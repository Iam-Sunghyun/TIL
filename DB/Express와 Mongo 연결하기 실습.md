# MongoDB 여러 모델 데이터 결합하기

farm 컬렉션 도큐먼트와 products 도큐먼트 간에 Two-Way Referencing, 즉 상호 참조 관계를 만들어보는 코드. 데이터 입력을 위한 템플릿은 생략하였다.

### 실습용 컬렉션
```
// mongosh
farmStand> show collections
farms
products
```

### farm 컬렉션 도큐먼트 스키마
```
const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must have name.."],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "must have email.."],
  },
  product: [  // ObjectId 타입의 배열, ref 옵션은 population시 사용할 모델을 지정한다.
    {         
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // 'Product' 모델(products 컬렉션)
    },
  ],
});

const Farm = mongoose.model("Farm", farmSchema);
module.exports = Farm;
```

### products 컬렉션 도큐먼트 스키마
```
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: { 
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "dairy", "vegetable"],
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farm", // 'Farm' 모델 (farms 컬렉션)
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
```

### 라우팅
```
// 카테고리용 배열
const categories = ['fruit', 'vegetable', 'dairy'];

// 특정 farm에 새 product 추가하는 페이지 라우팅
app.get('/farms/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    res.render('products/new', { categories, farm })
})

// 새 상품 추가 
app.post('/farms/:id/products', async (req, res) => {

    // 경로 파라미터로 연결하고자 하는 부모 도큐먼트(farm) 찾기
    const { id } = req.params;
    const farm = await Farm.findById(id);

    // HTML 폼 요청 페이로드로 자식 도큐먼트(product) 생성
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });

    // two-way-reference 연결
    farm.products.push(product);
    product.farm = farm;

    // mongodb 저장
    await farm.save();
    await product.save();

    res.redirect(`/farms/${id}`)
})

>> db.farm.find()
[
  {
    _id: ObjectId("6312516c3b94d272771eb1dc"),
    name: 'example1',
    city: 'example1',
    email: 'example1',
    product: [ 62fc886fa22669536d697cfc ],
    __v: 0
  }
]

>> db.products.find()
[
  {
    _id: ObjectId("62fc886fa22669536d697cfc"),
    name: 'Ruby Grape',
    price: 2.99,
    category: 'fruit',
    fram: 6312516c3b94d272771eb1dc,
    __v: 0
  }
]
```

# Mongoose 미들웨어로 여러 모델이 결합된 데이터 삭제하기

서로 다른 컬렉션의 도큐먼트들이 참조로 연결된 경우, 한 도큐먼트를 삭제하려고 한다면 참조 하고있는 도큐먼트도 값을 수정해줘야 할 것이다.

예를들어 한 웹 사이트 사용자가 계정을 삭제한 경우, 사용자가 작성한 글, 댓글 등 계정과 연결된 모든 데이터들을 삭제해 줄 필요가 있다.

이런 경우 수동으로 관계된 도큐먼트를 삭제해주거나, Monoogse 미들웨어 함수로 비동기 작업 전/후 수행할 내용을 정의하여 필요한 처리를 해줄 수 있다.

Mongoose 미들웨어는 4가지 종류(도큐먼트 미들웨어, 모델 미들웨어, aggregate 미들웨어, 쿼리(query) 미들웨어)가 있으며,`pre()`,`post()`를 선택적으로 호출하여 전/후 작업을 정의할 수 있다.

예시에서 사용한 미들웨어는 **쿼리 미들웨어**로 `Query` 객체 뒤에서 `exec()`, `then()`을 호출하거나 `await`을 사용하면 실행되는 미들웨어인데, `pre()`,`post()`의 첫 번째 인수로 전달한 이름의 메서드를 트리거하는 쿼리 함수를 호출하면 실행된다.

```
schema.pre('findOneAndUpdate', () => console.log('update'));
schema.post('findOne', () => console.log('findOne'));

const Model = mongoose.model('Model', schema);

// 어떤 미들웨어도 실행되지 않는다.
const query = Model.findOneAndUpdate({}, { name: 'test' });

// Prints "update"
await query.exec();

// Prints "findOne"
await Model.findOne({});
```

### Post

다음 예시는 'findOneAndDelete'를 트리거하는 쿼리 함수 사용시 실행되는 `post` 미들웨어이다.

`post` 미들웨어는 쿼리 결과를 콜백 함수의 첫 번째 매개변수(`doc`)에, 다음 미들웨어를 호출할 `next()` 메서드를 두 번째 매개변수에 전달한다. 

```
// 스키마 정의
const farmSchema = new Schema({
    name: { type: String, required: [true, 'Farm must have a name!'] },
    city: { type: String },
    email: { type: String, required: [true, 'Email required'] },
    products: [ { type: Schema.Types.ObjectId, ref: 'Product' }]
});

// post() 미들웨어 정의
// farm 도큐먼트 products 필드의 참조 값(_id)과 일치하는 모든 Product 모델 도큐먼트 삭제
farmSchema.post('findOneAndDelete', async function (farm) {
    if (farm.products.length) {
        const res = await Product.deleteMany({ _id: { $in: farm.products } }) // $in => MongoDB query selector 연산자 사용
        console.log(res);
    }
})

const Farm = mongoose.model('Farm', farmSchema);

// findByIdAndDelete()를 호출하면 findOneAndDelete()가 트리거 된다.
app.delete('farms/:id', async (req, res) => {
  const farm = await Farm.findByIdAndDelete(req.params.id);
  res.redirect('/farms');
});
```
### Pre
`pre` 미들웨어는 특정 함수 실행 이전에 hook되기 때문에 쿼리 결과를 전달받진 못하고 `next()` 함수 하나만 매개변수로 전달받으며, `next()` 호출 시 다음 `pre` 미들웨어로 제어가 넘어간다.

Express 미들웨어와 동일하게 `next()`를 호출한다고 해서 남은 코드를 스킵하는 것은 아니다. `return next()`와 같은 형태로 불필요한 `next()` 메서드 다음 코드를 실행하지 않을 수 있다. 

```
const schema = new Schema(..);
schema.pre('save', function(next) {
  if (...){
    next();
  }
  console.log('after next');  // 'after next'가 출력 됨.
});

// Mongoose 5.x에선 next() 호출 대신 프로미스를 반한하는 함수를 사용하여 제어를 넘길수도 있다(혹은 async/await).
schema.pre('save', function() {
  return doStuff().
    then(() => doMoreStuff());
});

// Or, in Node.js >= 7.6.0:
schema.pre('save', async function() {
  await doStuff();
  await doMoreStuff();
});
```
주의할 것은 Mongoose 모델 컴파일 후 `pre()`,`post()`를 통해 미들웨어 함수를 정의해주면 작동하지 않는다는 것. 따라서 모델 컴파일 이전에 `pre()`,`post()`를 호출해줘야 한다.

```
const schema = new mongoose.Schema({ name: String });
const User = mongoose.model('User', schema);

// 모델 생성 후 미들웨어를 정의해줬기 때문에 이 미들웨어는 호출되지 않는다.
schema.pre('save', () => console.log('Hello from pre save'));

const user = new User({ name: 'test' });
user.save();
```
<!-- Mongoose 메서드(위에선 Model.deleteMany())로 쿼리할 때도 mongoDB 명령어(query selector 연산자 $in..등)를 사용 가능했다-->
<!-- 참고자료 보충 필요 -->

### [mongoDB query selector 연산자($in...)]
https://www.mongodb.com/docs/v6.0/reference/operator/query/

### [Mongoose 미들웨어]
https://javascripttricks.com/mongoose-middleware-the-javascript-7d23a96bfcbf <br>
https://mongoosejs.com/docs/middleware.html