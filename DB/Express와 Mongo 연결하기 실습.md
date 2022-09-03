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
```

# Mongoose 미들웨어로 여러 모델이 결합된 데이터 삭제하기
