const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Users'; // Make sure this matches your DynamoDB table name

exports.handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);

        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ success: false, message: 'Username and password are required.' })
            };
        }

        // Check if the user already exists
        const existingUser = await dynamoDb.get({
            TableName: tableName,
            Key: { username }
        }).promise();

        if (existingUser.Item) {
            return {
                statusCode: 409,
                body: JSON.stringify({ success: false, message: 'User already exists.' })
            };
        }

        // Hash the password using bcryptjs
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Store the user in DynamoDB
        await dynamoDb.put({
            TableName: tableName,
            Item: { username, password: hashedPassword }
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: 'Internal Server Error' })
        };
    }
};
