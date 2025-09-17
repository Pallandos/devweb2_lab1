getRequestData = (request) => {
    return new Promise((resolve, reject) => {
        try {
            let body = ''
            //listen for data
            request.on('data', (chunk) => {
                body += chunk.toString()
            })
            request.on('end', () => {
                resolve(body)
            })
        }
        catch (error) {
            reject(error)
        }
    })
}

module.exports = getRequestData