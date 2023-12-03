
# Struttura per un progetto TypeScript

Ecco un esempio di struttura per un progetto TypeScript che segue il paradigma DDD (Domain-Driven Design) e event sourcing, con un read model:

```typescript
/src
  /domain
    /aggregates
      Order.ts
      // altre entità radicate
    /events
      OrderCreated.ts
      OrderShipped.ts
      // altri eventi del dominio
    /value-objects
      Money.ts
      // altri oggetti di valore
  /infrastructure
    /persistence
      EventStore.ts
      // altri componenti di persistenza
    /readmodel
      OrderReadModel.ts
      // altri read model
  /application
    /commands
      CreateOrderCommand.ts
      ShipOrderCommand.ts
      // altri comandi dell'applicazione
    /command-handlers
      CreateOrderCommandHandler.ts
      ShipOrderCommandHandler.ts
      // altri gestori di comandi
    /queries
      GetOrderQuery.ts
      // altre query dell'applicazione
    /query-handlers
      GetOrderQueryHandler.ts
      // altri gestori di query
  /infrastructure
    /messaging
      EventBus.ts
      // altri componenti di messaggistica
    /di
      container.ts
      // altri file di configurazione del container di inversione di controllo
  index.ts
  // altri file di avvio dell'applicazione
```

In questo esempio, la cartella `/src` contiene tutti i file sorgente del progetto. La cartella `/domain` contiene le entità radicate, gli eventi del dominio e gli oggetti di valore. La cartella `/infrastructure` contiene i componenti di persistenza, il read model, i comandi e i gestori di comandi, le query e i gestori di query, nonché i componenti di messaggistica e di configurazione del container di inversione di controllo. Infine, il file `index.ts` è il punto di ingresso dell'applicazione.
