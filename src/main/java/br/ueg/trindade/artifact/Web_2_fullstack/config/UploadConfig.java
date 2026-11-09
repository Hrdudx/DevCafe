package br.ueg.trindade.artifact.Web_2_fullstack.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

// Serve as fotos enviadas por upload: o arquivo uploads/produtos/x.png
// fica disponível em http://localhost:8080/uploads/produtos/x.png
@Configuration
public class UploadConfig implements WebMvcConfigurer {

    @Value("${devcafe.uploads.dir}")
    private String pastaUploads;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String local = Path.of(pastaUploads).toAbsolutePath().toUri().toString();
        registry.addResourceHandler("/uploads/**").addResourceLocations(local);
    }
}
