const frisby = require('frisby');
const faker = require('faker');
const config = require('./config.json');

const url = config.baseURL + config.customerPath;

const customer = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber()
};

describe('Simple GET request using Frisby, with Jest assertions', () => {
    it('GET against a mock endpoint', async () => {
        const customerOne = {
            id: 1,
            first_name: 'John',
            last_name: 'Smith',
            phone: '219-839-2819'
        };

        const data = await frisby.get(url)
        expect(data).toBeDefined();
        expect(data.status).toEqual(200);
        expect(data._json).toContainEqual(customerOne);
    })
});

describe('POST request using Frisby, with Jest assertions', () => {
    let id;

    it('POST against a mock endpoint', async () => {
        const post = await frisby.post(url, {
            body: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                phone: customer.phoneNumber
            },
            headers: {
                'Content-Type': 'application/json'
            }
        })
        expect(post.status).toEqual(201);
        id = post._json.id
    });

    it('GET against a mock endpoint', async () => {
        const get = await frisby.get(url + id)
        expect(get).toBeDefined();
        expect(get.status).toEqual(200);
        expect(get._json.first_name).toEqual(customer.firstName);
        expect(get._json.last_name).toEqual(customer.lastName);
        expect(get._json.phone).toEqual(customer.phoneNumber);
    })
});

describe('POST request using Frisby, with Jasmine assertions', () => {
    it('POST against a mock endpoint', () => {
        frisby
            .post(url, {
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
            .then((response) => {
                let cid = response.json.id
                frisby
                    .get(url + cid)
                    .expect('status', 200)
                    .expect('json', 'id', cid)
                    .expect('json', 'first_name', customer.firstName)
                    .expect('json', 'last_name', customer.lastName)
                    .expect('json', 'phone', customer.phoneNumber)
            })
    });
});