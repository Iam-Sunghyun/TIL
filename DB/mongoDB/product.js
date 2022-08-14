const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp')
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!");
        console.log(err);
    });

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 20
    },
    price: {
        type: Number,   // 숫자, 숫자로 형변환 가능한 문자열 모두 가능.
        required: true,
        min: [0, 'Price must be positive ya dodo!'] // 사용자 정의 에러메시지 지정
    },
    onSale: {
        type: Boolean,
        default: false
    },
    categories: [String], // 숫자를 삽입해도 문자열로 형변환 후 저장됨.
    qty: {
        online: {
            type: Number,
            default: 0
        },
        inStore: {
            type: Number,
            default: 0
        }
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L'] // String의 enum 옵션으로 유효한 값 지정
    }
});

// 인스턴스 메서드
productSchema.methods.greet = function () {
    console.log("HELLLO!!! HI!! HOWDY!!! ")
    console.log(`- from ${this.name}`)
}

// onSale 필드 값 전환 후 저장
productSchema.methods.toggleOnSale = function () {
    this.onSale = !this.onSale;
    return this.save();
};

// categories 필드에 값 추가
productSchema.methods.addCategory = function (newCat) {
    this.categories.push(newCat);
    return this.save();
};

// 정적 메서드
// Product 모델의 문서들(products 컬렉션의 문서들) 모두 업데이트
productSchema.statics.fireSale = function () {
    return this.updateMany({}, { onSale: true, price: 0 });
};


const Product = mongoose.model('Product', productSchema);

// 인스턴스 메서드 테스트용
const findProduct = async () => {
    const foundProduct = await Product.findOne({ name: 'Mountain Bike' });
    console.log(foundProduct);
    await foundProduct.toggleOnSale();
    console.log(foundProduct);
    await foundProduct.addCategory('Outdoors');
    console.log(foundProduct);
};

// Product.fireSale().then(res => console.log(res))

// findProduct();







// const bike = new Product({ name: 'Cycling Jersey', price: 28.50, categories: ['Cycling'], size: 'XS' })
// bike.save()
//     .then(data => {
//         console.log("IT WORKED!")
//         console.log(data);
//     })
//     .catch(err => {
//         console.log("OH NO ERROR!")
//         console.log(err)
//     })

// Product.findOneAndUpdate({ name: 'Tire Pump' }, { price: 9 }, { new: true, runValidators: true })
//     .then(data => {
//         console.log("IT WORKED!")
//         console.log(data);
//     })
//     .catch(err => {
//         console.log("OH NO ERROR!")
//         console.log(err)
//     })


