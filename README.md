<h1 align="center">
  certplan
</h1>

<p align="center">
  Planeje sua jornada de certificações em um calendário simples, organizado e conectado ao seu perfil.
</p>

![Hero da aplicação](./docs/image.png)

## Qual a finalidade do projeto?

O CertPlan é um projeto criado para aplicar **spec-driven development** na prática, transformando uma ideia de produto em funcionalidades guiadas por especificação, implementação e validação.

A proposta da aplicação é ajudar pessoas que estudam para certificações de tecnologia a organizar quando farão suas provas, acompanhar quais certificações já possuem e compartilhar quais estão buscando.

O coração do produto é uma visualização de calendário onde o usuário agenda exames de certificações como AWS, Azure, Cisco, Kubernetes, GCP e outras.


## Funcionalidades

| Funcionalidade | Descrição |
| --- | --- |
| Autenticação | Login e cadastro com Supabase, e-mail, GitHub e Google. |
| Calendário | Visualização mensal para planejar exames de certificação. |
| Catálogo | Certificações organizadas por fornecedor. |
| Certificações personalizadas | Cadastro de certificações que ainda não estão no catálogo. |
| Perfil público | Exibição das certificações conquistadas e em andamento. |
| Internacionalização | Suporte a português e inglês. |
| Tema | Alternância entre tema claro e escuro. |
| Lembretes por e-mail | Notificações antes da data do exame. |
| Cron de lembretes | Rotina automática para envio dos lembretes. |


## Tecnologias utilizadas

- **Next.js:** framework React com App Router para frontend, backend e rotas server-side;
- **React:** biblioteca para criação da interface;
- **TypeScript:** tipagem estática para aumentar a segurança da implementação;
- **Supabase:** autenticação, banco de dados Postgres e regras de acesso;
- **Tailwind CSS:** estilização da aplicação;
- **shadcn/ui:** base de componentes visuais;
- **next-intl:** internacionalização da interface;
- **Resend:** envio de e-mails transacionais;
- **Vercel:** deploy da aplicação e execução da rotina cron;
- **pnpm:** gerenciamento de dependências.





## Desenvolvedor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/luizbrito7">
        <img src="https://github.com/luizbrito7.png" width="100px;" alt="Foto do luizbrito7"/><br>
        <sub>
          <b>luizbrito7</b>
        </sub>
      </a>
    </td>
  </tr>
</table>
