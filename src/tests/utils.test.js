const {generateSalt,generateToken,checkPassword,hashPassword} = require('../utils/user.js')


describe("test utils",()=>{
    xtest("hash", async ()=>{
        const salt = await generateSalt()
        const response = await hashPassword("pass",salt)

    expect(response).toBeDefined()
    
    })

    xtest("check password", async ()=>{
        const salt = await generateSalt()

        const password = await hashPassword("pass",salt)

        const response = await checkPassword("pass", password)

        const token = generateToken("seba@gmail.com", "1")

        expect(response).toBe(true)
        expect(token)
    })

    xtest("test jwt", async ()=>{
        const token = generateToken("seba@gmail.com", "1")
        expect(token).toBeDefined()

    })


})