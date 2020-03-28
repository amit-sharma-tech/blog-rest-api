module.exports = {
    resp: (messageCode ,details= null,data=null) => { 
        let error = 1;
        let message = null;
        switch(messageCode){
            case 'VE' : 
                message  = 'ValidationError';
                break;
            case 'DBE':
                message = 'DatabaseError';
                break;
            case 'BRE':
                message = 'BadRequest';
                break;
            case 'RNF':
                message = 'ResourceNotFound';
                break;
            case 'ICE':
                message = 'InvalidCredentialsError';
                break;
            case 'UAE':
                message = 'UnauthorizedAccessError';
                break;
            case 'IUE':
                message = 'InactiveUserError';
                break;
            case 'ISE':
                message = 'InternalServerError';
                break;
            case 'RAE':
                message = 'RazorpayAPIError';
                break;
            case 'ERR':
                message = 'Invalid Error';
                break;
            case 'IRP':
                message = 'Invalid request parameter';
                break;
            case 'SUC':
                message = 'Success';
                error = 0;
                break;
            default:
                throw new Error('Unknow response message');

        }
        
        if(error == 0){
            return {
                statecode : messageCode,
                status : details,
                data
            }
        }else{
            return {
                error : error,
                statecode : messageCode,
                status : details,
                data
            }
        }
    }
};