const asyncHandler = (fn)=> async(req, reply)=>{
    try {
        await fn(req, reply);

    } catch (error) {
        reply.status(error.code || 500).send({
          success: false,
          message: error.message,
        });
    }
}


export { asyncHandler };
