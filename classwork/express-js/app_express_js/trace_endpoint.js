// TRACE Endpoint - Echo back request details
export function traceEndpoint(app) {
    app.trace("/trace", (req, res) => {
        try {
            const traceInfo = {
                success: true,
                message: "Request trace information",
                method: req.method,
                url: req.originalUrl,
                path: req.path,
                protocol: req.protocol,
                hostname: req.hostname,
                ip: req.ip,
                remoteAddress: req.connection.remoteAddress,
                headers: req.headers,
                timestamp: new Date().toISOString(),
                userAgent: req.get("user-agent")
            };

            res.status(200).json(traceInfo);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message
            });
        }
    });
}
