const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test_helpers')

describe('Protected endpoints', function() {
  let db

  const testUsers = helpers.makeTestUsers()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanDB(db))

  afterEach('cleanup', () => helpers.cleanDB(db))

  beforeEach('insert users', () =>
  	helpers.seedUsers(db, testUsers)
  )

  const protectedEndpoints = [
    {
		name: 'GET /notes',
		path: '/notes',
		method: supertest(app).get,
	},
	{
		name: 'POST /notes',
		path: '/notes',
		method: supertest(app).post,
	},
    {
		name: 'DELETE /notes/:noteId',
		path: '/notes/:noteId',
		method: supertest(app).delete,
    },
    {
		name: 'GET /folders',
		path: '/folders',
		method: supertest(app).get,
	},
	{
		name: 'POST /folders',
		path: '/folders',
		method: supertest(app).post,
	},
	{
		name: 'DELETE /folders/:folderId',
		path: '/folders/:folderId',
		method: supertest(app).delete,
	},
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { user_handle: 'user-not-existy' }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})