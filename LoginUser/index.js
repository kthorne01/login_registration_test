const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users';
const secretKey = 'YourSecretKey'; // **Important:** Replace with a secure key and store it securely

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: 'Username and password are required.' })
        };
    }

    const user = await dynamoDb.get({
        TableName: tableName,
        Key: { username }
    }).promise();

    if (!user.Item) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: 'Invalid credentials.' })
        };
    }

    const isPasswordValid = bcrypt.compareSync(password, user.Item.password);
    if (!isPasswordValid) {
        return {
            statusCode: 401,
            body: JSON.stringify({ success: false, message: 'Invalid credentials.' })
        };
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    return {
        statusCode: 200,
        body: JSON.stringify({ success: true, token })
    };
};
