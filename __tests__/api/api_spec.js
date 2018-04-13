const frisby = require('frisby');
const Joi = frisby.Joi;
const faker = require('faker');

const customer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber()
};

it('should be a teapot', function (done) {
    frisby.get('http://httpbin.org/status/418')
        .expect('status', 418)
        .done(done);
});

it('should return a status of 200', function (done) {
    frisby
        .get('https://jsonfeed.org/feed.json')
        .expect('status', 200)
        .expect('json', 'version', 'https://jsonfeed.org/version/1')
        .expect('json', 'title', 'JSON Feed')
        .expect('jsonTypes', 'items.*', { // Assert *each* object in 'items' array
            'id': Joi.string().required(),
            'url': Joi.string().uri().required(),
            'title': Joi.string().required(),
            'date_published': Joi.date().iso().required(),
        })
        .done(done);
});

it('GET against a mock endpoint', function (done) {
    frisby
        .get('http://localhost:3000/customers')
        .expect('status', 200)
        .expect('jsonTypes', '0', { // Assert *each* object in 'items' array
            'id': Joi.number().required(),
            'first_name': Joi.string().required(),
            'last_name': Joi.string().required(),
            'phone': Joi.string().required(),
            'id': 1,
            'first_name': 'John',
            'last_name': 'Smith',
            'phone': '219-839-2819'
        })
        .done(done);
});

it.only('POST against a mock endpoint', function (done) {
    frisby
        .post('http://localhost:3000/customers', {
            body: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                phone: customer.phoneNumber
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .expect('status', 201)
        .then(function (customerResponse) {
            let cid = customerResponse.json.id
            frisby
                .get('http://localhost:3000/customers/' + cid)
                .expect('status', 200)
                .expect('json', 'id', cid)
                .expect('json', 'first_name', customer.firstName)
                .expect('json', 'last_name', customer.lastName)
                .expect('json', 'phone', customer.phoneNumber)
        })
        .done(done);
});