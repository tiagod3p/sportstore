const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Product = require('./src/app/models/Product')
const File = require('./src/app/models/File')

let totalUsers = 5
let totalProducts = 10

let usersIds = []
let productsIds = []

async function createUsers() {
    let users = []
    const password = await hash('123', 8)

    while ( users.length < totalUsers) {
        users.push( {
            name: faker.name.findName(),
            email: faker.internet.email(),
            password,
            cpf_cnpj: faker.random.number(1111111111),
            cep: faker.random.number(8888888888888),
            address: faker.address.streetAddress()
        })
    }

    const userPromise = users.map(user => User.add(user))

    usersIds = await Promise.all(userPromise)
}

async function createProducts() {
    let products = []

    while (products.length < totalProducts) {
        products.push({
            category_id: Math.ceil(Math.random() * 9),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            name: faker.name.title(),
            description: faker.lorem.paragraph(Math.ceil(Math.random() * 5)),
            old_price: faker.random.number(9999),
            price: faker.random.number(9999),
            quantity: faker.random.number(9999),
            status: Math.round(Math.random())
        })
    }

    const productsPromise = products.map(product => Product.add(product))
    productsIds = await Promise.all(productsPromise)

    let files = []

    while (files.length < 30) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
    }

    const filesPromise = files.map(file => File.add(file))
    await Promise.all(filesPromise)
}

async function init() {
    await createUsers()
    await createProducts()
}

init()