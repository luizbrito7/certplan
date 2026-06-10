a ideia é ter uma plataforma para planejar quando fazer provas de certificação (aws, azure, ccna, k8s, etc).

a idea é ter uma interface amigavel com perfil para o usuário 

um dos principais pontos é que o deploy vai ser na vercel (front e back) e o db/gestão de usuários vai ser com supabase (quero algo simples)

a base vai vim disso: https://vercel.com/templates/next.js/supabase vamos usar esse exemplo e tabalhar encima dele para gestão de usuários. O login/cadastro vai poder ser feito com a base do supabase e também github e google. 

vamos usar o padrão de design system do shadcn mesmo todos os componentes vão vim dele e sempre dele

regra de ngc, a ideia é que o usuário tenha uma visualização de calendario onde ele marca nesse calendario qual certificação vai fazer e em qual data. Basicamente esse é o core/coração da aplicação. 

pode ter uma parte de perfil e vc pode visualizar o perfil de outros usuário, no perfil vai ter quais certs o usuário já tem e quais ele está buscando.