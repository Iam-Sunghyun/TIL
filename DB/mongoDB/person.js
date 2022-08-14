const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!!");
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!");
        console.log(err);
    });

const personSchema = new mongoose.Schema({
    first: String,
    last: String
});

// 가상 getter, setter 함수 생성
personSchema.virtual('fullName').
    get(function () {
        return this.first + ' ' + this.last;
    }).
    set(function (v) {
        this.first = v.substr(0, v.indexOf(' '));
        this.last = v.substr(v.indexOf(' ') + 1);
    });

personSchema.pre('save', async function () {
    this.first = 'YO';
    this.last = 'MAMA';
    console.log("ABOUT TO SAVE!!!!");
});
personSchema.post('save', async function () {
    console.log("JUST SAVED!!!!");
});

// document 생성
const Person = mongoose.model('Person', personSchema);

// 가상 getter 테스트
const tammy = new Person({ first: 'Tammy', last: 'Chow' });
console.log(tammy.fullName); // Tammy Chow

// 가상 setter 테스트
tammy.fullName = `Tammy Xiao`;
console.log(tammy.fullName); // Tammy xiao
