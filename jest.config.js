module.exports = {
    testEnvironment: "jest-environment-jsdom", 
    moduleNameMapper: {
        '\\.(scss|sass|css)$': 'identity-obj-proxy'
    }, 
    setupFilesAfterEnv: ['<rootDir>/jest-setup.js']
}