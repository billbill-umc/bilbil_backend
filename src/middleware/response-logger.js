import morgan from "morgan";
import logger from "@/config/logger";

const responseLogger = morgan("[Response] :method :url => :remote-addr with status :status in :response-time ms", {
    stream: {
        write: message => logger.info(message.trim())
    }
});

export default responseLogger;
