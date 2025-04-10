# Guia do Usuário - CranioScan 3D

## Introdução

O CranioScan 3D é um aplicativo especializado para pediatras e fisioterapeutas que tratam assimetria craniana em bebês. Este guia fornece instruções detalhadas sobre como utilizar todas as funcionalidades do aplicativo.

## Índice

1. [Primeiros Passos](#1-primeiros-passos)
2. [Gerenciamento de Pacientes](#2-gerenciamento-de-pacientes)
3. [Registro de Medições](#3-registro-de-medições)
4. [Visualização de Resultados](#4-visualização-de-resultados)
5. [Gráficos de Evolução](#5-gráficos-de-evolução)
6. [Exportação de Relatórios](#6-exportação-de-relatórios)
7. [Assistente Virtual](#7-assistente-virtual)
8. [Perfil e Configurações](#8-perfil-e-configurações)

## 1. Primeiros Passos

### Registro e Login

1. Ao abrir o aplicativo pela primeira vez, toque em "Criar Conta"
2. Preencha seus dados profissionais (nome, e-mail, senha)
3. Opcionalmente, cadastre sua clínica (nome, CNPJ, endereço)
4. Após o registro, faça login com seu e-mail e senha

### Navegação Principal

O aplicativo possui cinco seções principais acessíveis pela barra de navegação inferior:
- **Início**: Visão geral e acesso rápido às funcionalidades
- **Pacientes**: Lista e gerenciamento de pacientes
- **Medições**: Registro de novas medições cranianas
- **Relatórios**: Visualização de resultados e exportação
- **Perfil**: Configurações do usuário e da aplicação

## 2. Gerenciamento de Pacientes

### Cadastro de Novo Paciente

1. Na tela de Pacientes, toque no botão "+" no canto inferior direito
2. Preencha os dados do paciente:
   - Nome completo
   - Data de nascimento
   - Gênero
   - Dados da mãe (obrigatórios: nome, CPF e telefone)
   - Dados do pai (opcionais)
3. Toque em "Salvar" para concluir o cadastro

### Visualização e Edição de Pacientes

1. Na lista de pacientes, toque no nome do paciente desejado
2. Na tela de detalhes, você pode:
   - Visualizar informações básicas
   - Tocar em "Editar" para modificar os dados
   - Acessar o histórico de medições
   - Registrar nova medição
   - Visualizar relatórios e gráficos

### Exclusão de Paciente

1. Na lista de pacientes, deslize o nome do paciente para a esquerda
2. Toque no botão "Excluir" que aparecerá
3. Confirme a exclusão quando solicitado

## 3. Registro de Medições

### Nova Medição

1. Acesse a tela do paciente desejado
2. Toque em "Nova Medição" ou acesse a aba "Medições" na navegação principal
3. Selecione o paciente (se ainda não estiver selecionado)
4. Preencha os campos de medição:
   - Data da avaliação
   - Diâmetro do crânio (mm)
   - Comprimento do crânio (mm)
   - Largura do crânio (mm)
   - Diagonal direita do crânio (mm)
   - Diagonal esquerda do crânio (mm)
5. Toque em "Salvar" para registrar a medição

### Visualização de Medições Anteriores

1. Na tela do paciente, toque em "Histórico de Medições"
2. A lista mostrará todas as medições ordenadas por data
3. Toque em uma medição específica para ver os detalhes completos

## 4. Visualização de Resultados

### Relatório Individual

1. Na tela do paciente, toque em "Relatório" ou selecione uma medição específica
2. O relatório mostrará:
   - Dados do paciente
   - Medidas cranianas registradas
   - Métricas calculadas:
     - Diferença das diagonais (mm)
     - Índice Craniano (%)
     - CVAi (Índice de Assimetria da Abóbada Craniana)
   - Classificações automáticas:
     - Plagiocefalia (baseada na diferença das diagonais)
     - Braquicefalia/Dolicocefalia (baseada no Índice Craniano)
     - Escala de Plagiocefalia de Atlanta (baseada no CVAi)

### Interpretação das Classificações

#### Plagiocefalia (diferença das diagonais)
- **Até 4 mm**: Aceitável
- **Entre 4 e 7 mm**: Plagiocefalia leve
- **Entre 7 e 15 mm**: Plagiocefalia moderada
- **Acima de 15 mm**: Plagiocefalia severa

#### Braquicefalia/Dolicocefalia (Índice Craniano)
- **Entre 75 e 85%**: Normal
- **Entre 70 e 75%**: Dolicocefalia leve
- **Abaixo de 70%**: Dolicocefalia moderada
- **Entre 85 e 90%**: Braquicefalia leve
- **Entre 90 e 97%**: Braquicefalia moderada
- **Acima de 97%**: Braquicefalia severa

#### Escala de Plagiocefalia de Atlanta (CVAi)
- **Nível 1**: <3,5
- **Nível 2**: 3,5 – 6,25
- **Nível 3**: 6,25 – 8,75
- **Nível 4**: 8,75 – 11,0
- **Nível 5**: >11,0

## 5. Gráficos de Evolução

### Tipos de Gráficos Disponíveis

1. Na tela do paciente, toque em "Gráficos" ou "Evolução"
2. Selecione entre os diferentes tipos de gráficos:
   - **Diâmetro**: Evolução da largura e comprimento craniano
   - **Diagonais**: Evolução das diagonais e sua diferença
   - **Índice Craniano**: Evolução do IC com linhas de referência para classificação
   - **CVAi**: Evolução do CVAi com linhas de referência para os níveis da Escala de Atlanta

### Interpretação dos Gráficos

- As linhas coloridas nos gráficos representam os limites entre as diferentes classificações
- A tendência descendente na diferença das diagonais ou no CVAi indica melhora na plagiocefalia
- A tendência do Índice Craniano em direção à faixa 75-85% indica normalização da forma craniana

## 6. Exportação de Relatórios

### Geração de PDF

1. Na tela de relatório do paciente, toque no ícone de download no canto superior direito
2. O aplicativo gerará um PDF completo contendo:
   - Dados do paciente
   - Histórico de medições em formato tabular
   - Análise detalhada da última avaliação
   - Classificações e interpretações
   - Recomendações personalizadas baseadas nos resultados

### Compartilhamento do Relatório

1. Após a geração do PDF, o menu de compartilhamento do dispositivo será exibido
2. Selecione o método desejado para compartilhar (e-mail, WhatsApp, etc.)
3. O relatório será enviado no formato PDF

## 7. Assistente Virtual

### Consulta ao Assistente

1. Na tela inicial ou na tela do paciente, toque em "Assistente Virtual"
2. Digite sua pergunta na caixa de texto na parte inferior
3. Toque no botão de envio para processar a pergunta

### Tipos de Consultas Suportadas

O assistente virtual, alimentado pela API Gemini, pode responder a perguntas sobre:
- Interpretação de medições específicas do paciente
- Recomendações de tratamento baseadas nos resultados
- Informações gerais sobre assimetria craniana
- Explicações sobre as classificações e métricas
- Orientações sobre desenvolvimento craniano infantil

### Contexto do Paciente

Quando acessado a partir da tela de um paciente específico, o assistente já terá acesso ao contexto desse paciente, incluindo:
- Dados básicos (nome, idade)
- Última medição realizada
- Classificações e tendências observadas

## 8. Perfil e Configurações

### Edição de Perfil

1. Acesse a aba "Perfil" na navegação principal
2. Toque em "Editar Perfil" para modificar suas informações
3. Atualize sua foto, nome, especialidade ou outros dados
4. Toque em "Salvar" para confirmar as alterações

### Configurações do Aplicativo

1. Na tela de Perfil, toque em "Configurações"
2. Ajuste as preferências disponíveis:
   - Modo claro/escuro
   - Notificações
   - Unidades de medida
   - Preferências de exportação

### Gerenciamento de Clínica

1. Na tela de Perfil, toque em "Minha Clínica"
2. Visualize ou edite os dados da clínica cadastrada
3. Se não houver clínica cadastrada, você poderá adicionar uma nova

### Logout

1. Na tela de Perfil, role até o final
2. Toque no botão "Sair" para fazer logout do aplicativo

## Suporte e Ajuda

Para obter suporte adicional ou relatar problemas, entre em contato através do e-mail support@cranioscan3d.com ou pelo telefone (XX) XXXX-XXXX.

---

© 2025 CranioScan 3D - Todos os direitos reservados
