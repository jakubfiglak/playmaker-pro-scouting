const request = require('supertest');
const User = require('../../../models/User');

let server;

const path = '/api/v1/auth/register';

describe(path, () => {
  beforeEach(() => {
    // eslint-disable-next-line global-require
    server = require('../../../server');
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  describe('POST /', () => {
    let newUser;

    const exec = () => {
      const res = request(server).post(path).send(newUser);
      return res;
    };

    beforeEach(() => {
      newUser = {
        name: 'John',
        surname: 'Doe',
        email: 'john@gmail.com',
        phone: '123456789',
        address: 'ul. Cicha 132/16 62-200 Gniezno',
        activeRadius: 100,
        password: 'Abc123',
        passwordConfirm: 'Abc123',
      };
    });

    it('should return 400 if name is not provided', async () => {
      newUser.name = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('name');
    });

    it('should return 400 if surname is not provided', async () => {
      newUser.surname = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('surname');
    });

    it('should return 400 if email is not provided', async () => {
      newUser.email = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('email');
    });

    it('should return 400 if provided email is not a valid email address', async () => {
      newUser.email = 'email';

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('email');
    });

    it('should return 400 if provided phone number is not a valid phone number', async () => {
      newUser.phone = '123';

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('phone');
    });

    it('should return 400 if address is not provided', async () => {
      newUser.address = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('address');
    });

    it('should return 400 if activeRadius is not provided', async () => {
      newUser.activeRadius = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('distance');
    });

    it('should return 400 if password is not provided', async () => {
      newUser.password = undefined;
      newUser.passwordConfirm = undefined;

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('password');
    });

    it('should return 400 if password is not strong enough', async () => {
      newUser.password = 'abc123';
      newUser.passwordConfirm = 'abc123';

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('must contain');
    });

    it('should return 400 if provided passwords do not match', async () => {
      newUser.passwordConfirm = 'abc123';

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('do not match');
    });

    it('should return 400 if a user with the given email already exists', async () => {
      await User.collection.insertOne(newUser);

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('already exists');
    });

    it('should add new user to database if the request is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(201);
    });

    it('should not save address provided by user to the database', async () => {
      const res = await exec();

      expect(res.body.data.address).toBeUndefined();
    });

    it('should populate user object with properly formatted location field', async () => {
      const res = await exec();

      expect(res.body.data.location).toBeDefined();
      expect(res.body.data.location).toHaveProperty('type');
      expect(res.body.data.location).toHaveProperty('coordinates');
      expect(res.body.data.location).toHaveProperty('formattedAddress');
      expect(res.body.data.location).toHaveProperty('street');
      expect(res.body.data.location).toHaveProperty('city');
      expect(res.body.data.location).toHaveProperty('voivodeship');
      expect(res.body.data.location).toHaveProperty('zipcode');
    });

    it('should return a token if the request is valid', async () => {
      const res = await exec();
      expect(res.body).toHaveProperty('token');
      expect(res.body.token).toBeDefined();
    });
  });
});
