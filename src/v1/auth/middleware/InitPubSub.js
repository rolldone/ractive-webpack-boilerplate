const InitPubSub = async function(to, the_from, done, nextMiddleware) {
    console.log('InitPubSub - called');
	return nextMiddleware();
};

export default InitPubSub;