const asyncHandler = (fn)=> async(req, reply, next)=>{
    try {
        await fn(req, reply, next);

    } catch (error) {
        reply.status(error.code || 500).send({
          success: false,
          message: error.message,
        });
    }
}


export { asyncHandler };
