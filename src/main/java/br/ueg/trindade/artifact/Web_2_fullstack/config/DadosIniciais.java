package br.ueg.trindade.artifact.Web_2_fullstack.config;

import br.ueg.trindade.artifact.Web_2_fullstack.model.Permissao;
import br.ueg.trindade.artifact.Web_2_fullstack.model.Usuario;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.PermissaoRepository;
import br.ueg.trindade.artifact.Web_2_fullstack.repository.UsuarioRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DadosIniciais {

    // Cria um administrador na primeira vez que a aplicação sobe, para que
    // sempre exista alguém capaz de entrar e cadastrar os demais usuários.
    // A senha fica em Java (e não no data.sql) para ser gravada já criptografada.
    // Também cria as permissões básicas e dá ao administrador a permissão ADMIN,
    // para a tela "Atribuir Permissões" (Aula 07) não começar vazia.
    @Bean
    public CommandLineRunner criarAdministrador(UsuarioRepository usuarioRepository,
                                                PermissaoRepository permissaoRepository,
                                                PasswordEncoder passwordEncoder) {
        return args -> {
            Usuario admin = usuarioRepository.findByEmail("admin@devcafe.com")
                    .orElseGet(() -> usuarioRepository.save(new Usuario(
                            "Administrador",
                            "admin",
                            passwordEncoder.encode("admin123"),
                            "admin@devcafe.com")));

            if (permissaoRepository.count() == 0) {
                Permissao administrador = permissaoRepository.save(
                        new Permissao("ADMIN", "Acesso total ao sistema"));
                permissaoRepository.save(new Permissao("ATENDENTE", "Registra e acompanha pedidos"));

                admin.getPermissoes().add(administrador);
                usuarioRepository.save(admin);
            }
        };
    }
}
