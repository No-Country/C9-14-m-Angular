const {DB_HOST,DB_NAME,DB_PASS,DB_PORT,DB_USER,PORT,APP_ENV} = require('../config/config.js')


describe("config test",()=> {
    test("with standard environment", ()=> {
        expect(APP_ENV).toBe("development")
    })

    
})