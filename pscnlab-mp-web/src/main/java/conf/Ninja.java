package conf;

import com.google.inject.Inject;
import com.jiabangou.core.exceptions.ServiceException;
import com.jiabangou.ninja.extentions.error.ErrorProperties;
import com.jiabangou.ninja.extentions.utils.JsonJsonpUtils;
import ninja.*;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Ninja extends NinjaDefault {


    private static final Logger LOGGER = LoggerFactory.getLogger(Ninja.class);

    @Inject
    private ErrorProperties errorProperties;


    @Override
    public void onRouteRequest(Context.Impl context) {

        String httpMethod = context.getMethod();

        Route route = router.getRouteFor(httpMethod, context.getRequestPath());

        context.setRoute(route);

        if (route != null) {

            Result underlyingResult = null;
            try {
                underlyingResult = route.getFilterChain().next(context);
                resultHandler.handleResult(underlyingResult, context);

            } catch (Exception exception) {

                if (JsonJsonpUtils.isJsonOrJsonp(route)) {
                    renderErrorResultAndCatchAndLogExceptions(
                            JsonJsonpUtils.getJsonJsonpErrorResult(context, exception, errorProperties), context);
                } else {
                   /* if(exception instanceof ServiceException ){
                        ServiceException serviceException=(ServiceException)exception;
                        if(MerchantExceptionConstants.no_mch_info.getCode()==serviceException.getCode()||
                                MerchantExceptionConstants.store_not_exist.getCode()==serviceException.getCode()){
                            Result result = Results.forbidden().template("/views/system/404notFound.ftl.html");
                            renderErrorResultAndCatchAndLogExceptions(result,context);
                        }
                    }*/
                    // call special handler to capture the underlying result if there is one
                    Result result = onException(context, exception, underlyingResult);
                    renderErrorResultAndCatchAndLogExceptions(result, context);
                }
            } finally {

                context.cleanup();

            }

        } else {
            if (isJsonJsonp(context)) {
                renderErrorResultAndCatchAndLogExceptions(
                        JsonJsonpUtils.getJsonJsonpErrorResult(context,
                                new ServiceException(ServiceException.CODE_10001_NOT_FOUND, "data not found"),
                                errorProperties),
                        context);
            } else {
                // throw a 404 "not found" because we did not find the route
                Result result = getNotFoundResult(context);
                renderErrorResultAndCatchAndLogExceptions(result, context);
            }

        }

    }

    private boolean isJsonJsonp(Context context) {
        String contentType = context.getRequestContentType();
        if (Result.APPLICATION_JSON.equals(contentType) || Result.APPLICATION_JSONP.equals(contentType)) {
            return true;
        }
        String extension = FilenameUtils.getExtension(context.getRequestPath());
        if ("json".equals(extension) || "jsonp".equals(extension)) {
            return true;
        }
        return false;
    }

}
