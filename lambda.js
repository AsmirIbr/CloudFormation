const AWS = require('aws-sdk');
var apigateway = new AWS.APIGateway({apiVersion: '2015/07/09'});
var codepipeline = new AWS.CodePipeline()
AWS.config.region = 'eu-west-2';

exports.handler = function (event, context, callback){

    const done = (err, data) => callback(null, {
      statusCode: err ? 500 : 200,
      body: err ? JSON.stringify({
        'statusCode': 500,
        'message': err.message
      }) : JSON.stringify(data)
    })
    
    var params = {
      restApiId: 'll8jay0v80', 
      stageName: 'production'
    };
    
    apigateway.createDeployment(params, done);

    const jobId = event["CodePipeline.job"].id
    try {
      const params = {
        jobId
      }
      codepipeline.putJobSuccessResult(params).promise()
    }
    catch (err) {
      const params = {
        jobId,
        failureDetails: {
          message: err.toString(),
          type: 'JobFailed',
          externalExecutionId: context.invokeid
        }
      }
      codepipeline.putJobFailureResult(params).promise()
    }
  };