const GetCommonData = async function(to, the_from, done, nextMiddleware) {
    console.log('GetCommonData - called');
	return nextMiddleware();
};

export default GetCommonData;