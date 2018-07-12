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
    content: faker.loerm.paragraph(),
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
  return mongoose.connection.dropDataBase();
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

});
