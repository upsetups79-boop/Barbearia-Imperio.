# Barbearia Imperial - Agendamento Online

Sistema de agendamento white-label para barbearias: página pública mobile-first, confirmação na
tela e painel do proprietário protegido por senha.

## Rodando o projeto

```bash
npm install
npm run dev       # ambiente de desenvolvimento
npm run test      # 28 testes automatizados
npm run build     # typecheck + build de produção (dist/)
```

Rotas (hash routing, funciona em qualquer hospedagem estática):

| Rota | Descrição |
|---|---|
| `/#/` | Página pública de agendamento |
| `/#/confirmacao/:id` | Resumo do agendamento confirmado |
| `/#/admin` | Painel do proprietário |

## Senha do painel

Padrão: `imperial2024`.

Para alterar, crie um arquivo `.env` na raiz:

```ini
VITE_ADMIN_PASSWORD=suaSenhaForte
```

A senha é validada no navegador: protege contra acesso casual, mas não substitui autenticação de
servidor. Para uso em produção com múltiplos clientes, migre para Supabase Auth (ver abaixo).

## Personalizando para outra barbearia

Todo o conteúdo comercial fica em `src/config/shop.ts`:

- `SHOP` - nome, slogan, endereço, WhatsApp, janela de agendamento e antecedência mínima
- `OPENING_HOURS` - horário por dia da semana (`null` = fechado)
- `SERVICES` - serviços, preços e duração
- `PROFESSIONALS` - equipe, cargos e especialidades

Nenhum componente precisa ser alterado para revender o sistema.

## Arquitetura

```
src/
├─ config/shop.ts          # personalização da barbearia
├─ types/                  # contratos de dados
├─ lib/                    # disponibilidade, datas, formatação, .ics
├─ data/                   # camada de persistência plugável
├─ components/             # UI de agendamento e do painel
└─ pages/                  # Home, Confirmation, Admin
```

A UI conversa apenas com a interface `BookingRepository` (`src/data/bookingRepository.ts`). Hoje ela
é implementada por `localStorageAdapter`. Para migrar os dados para a nuvem, basta criar um
`supabaseAdapter` que implemente a mesma interface e trocar a instância exportada - nenhuma tela
precisa ser reescrita.

## Regras de negócio garantidas por teste

- Grade de horários respeita o funcionamento de cada dia e fecha aos domingos
- Combo de 60 min não é oferecido quando não cabe antes do fechamento
- Sobreposição parcial entre atendimentos do mesmo profissional é bloqueada
- Cancelamento libera o horário de volta para a agenda pública
- Horários passados somem quando o cliente agenda para o mesmo dia
- Reserva dupla é rejeitada na gravação, não apenas na tela
