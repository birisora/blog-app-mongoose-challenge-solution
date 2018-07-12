'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

// allows for expect syntax
const expect = chai.expect;

const { BlogPost } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// Here we'll make a function to make fake seed data using Faker
function seedBlogpostData () {
  console.info('seeding blogpost data');
  const seedData = [];

  for (let i = 1; i <= 10; i += 1) {
    seedData.push(generateBlogpostData());
  }
  // return a promise
  return BlogPost.insertMany(seedData);
}

// need data for title, content, author
function generateBlogpostData () {
  return {
    title: faker.commerce.productName(),
    content: faker.lorem.paragraph(),
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    }
  };
}

// Creating a function to delete the entire DB
// called in afterEach block so that data from one test
// doesn't stick around for next
function tearDownDb () {
  console.warn('Deleting Database');
  return mongoose.connection.dropDatabase();
}

// need each hook functions to return a promise
// otherwise need a done callback
describe('BlogPost API resource', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });
  
  beforeEach(function () {
    return seedBlogpostData();
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  // Now we can make tests for each of the endpoints
  describe('GET endpoint', function () {
    it('should return all existing blogposts', function () {
      // get all posts returned by GET req to /posts
      // prove has right status and data type
      // prove number of posts equal to num in db
      let res;
      return chai.request(app)
        .get('/posts')
        .then(function (_res) {
          res = _res;
          expect(res).to.have.status(200);
          // otherwise db seeding failed
          expect(res.body).to.have.lengthOf.at.least(1);
          return BlogPost.count();
        })
        .then(function (count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });

    it('should return blogposts with right fields', function () {
      // get back all posts and ensure have expected keys
      let resBlogpost;
      return chai.request(app)
        .get('/posts')
        .then(function (res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function (post) {
            expect(post).to.be.a('object');
            expect(post).to.include.keys (
              'id', 'title', 'content', 'author', 'created');
          });
          resBlogpost = res.body[0];
          return BlogPost.findById(resBlogpost.id);
        })
        .then(function (blogpost) {
          expect(resBlogpost.id).to.equal(blogpost.id);
          expect(resBlogpost.title).to.equal(blogpost.title);
          expect(resBlogpost.content).to.equal(blogpost.content);
          // since blogpost.author is an object while resBlogpost.author is string
          expect(resBlogpost.author).to.contain(blogpost.author.firstName, blogpost.author.lastName);
        });
    });
  });

  // POST
});
