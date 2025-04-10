# CranioScan 3D - Versão Atualizada

Este repositório contém a versão atualizada do aplicativo CranioScan 3D para avaliação de assimetria craniana em bebês, com todas as correções e melhorias implementadas conforme solicitado.

## Estrutura do Projeto

- `/api` - Backend em Node.js
- `/mobile` - Aplicativo React Native
- `/documentation` - Documentação técnica e guia do usuário
- `/infra` - Arquivos de configuração de infraestrutura

## Principais Melhorias Implementadas

1. **Correções de sincronização de dados**
   - Atualização automática após registro de pacientes ou medições
   - Correção da função de exclusão de pacientes

2. **Melhorias no login e gerenciamento de usuários**
   - Correção do problema de "tela de carregamento infinito" no login
   - Sistema de registro de usuários
   - Perfil de usuário completo com configurações
   - Cadastro de clínica
   - Botão de logout

3. **Redesenho da interface**
   - Nova paleta de cores em tons de azul (#1E88E5, #64B5F6, #BBDEFB)
   - Sistema de temas com suporte para modo escuro/claro

4. **Novas métricas e classificações**
   - Índice Craniano (IC)
   - Índice Craniano Vertical Anterior (CVAi)
   - Classificações automáticas de plagiocefalia, braquicefalia e dolicocefalia

5. **Exportação de PDF**
   - Relatório clínico completo com dados do paciente, histórico de medições e recomendações

6. **Expansão do cadastro de pacientes**
   - Dados dos pais (nome, CPF, telefone, email, data de nascimento)

7. **Integração com API Gemini**
   - Assistente virtual para recomendações e análises avançadas

## Documentação

A documentação completa está disponível na pasta `/documentation`:

- `melhorias_implementadas.md` - Detalhes técnicos de todas as correções e melhorias
- `guia_usuario.md` - Guia completo para utilização do aplicativo

## Instalação e Execução

### Requisitos

- Node.js 14+
- React Native CLI
- Android Studio / Xcode (para desenvolvimento mobile)
- Docker e Docker Compose (para ambiente de desenvolvimento)

### Configuração do Ambiente

1. Clone este repositório
2. Instale as dependências do backend:
   ```
   cd api
   npm install
   ```
3. Instale as dependências do frontend:
   ```
   cd mobile
   npm install
   ```

### Execução em Ambiente de Desenvolvimento

1. Inicie o backend:
   ```
   cd api
   npm run dev
   ```
2. Inicie o aplicativo mobile:
   ```
   cd mobile
   npm start
   ```

### Execução com Docker

```
docker-compose up
```

## Testes

Todos os componentes foram testados extensivamente para garantir o funcionamento correto de todas as funcionalidades. Para executar os testes:

```
cd mobile
npm test
```

## Contato

Para suporte ou mais informações, entre em contato através do email support@cranioscan3d.com
