## Limitaciones de Hardware en MongoDB Replica Sets

### **Limitaciones de RAM**

**Consumo de Memoria:**
- MongoDB usa hasta aproximadamente 85% de la RAM disponible del sistema
- MongoDB no gestiona la memoria directamente - depende del OS para paginación
- Mínimo requerido: 2 GB de RAM para despliegues pequeños
- Recomendado: mínimo 4 GB de RAM

**Problemas de RAM insuficiente:**
- Paginación constante entre memoria y disco (swapping)
- Degradación severa del rendimiento
- Los índices no caben en memoria = consultas lentas
- El "working set" (documentos frecuentemente usados) se va a disco

**En Replica Sets:**
- Los servidores pueden tener diferente cantidad de RAM, pero no es recomendable
- El nodo con menos RAM será el cuello de botella
- Durante failover, el nuevo primario debe tener suficiente RAM

### **Limitaciones de Disco**

**Espacio de Almacenamiento:**
- Mínimo 10 GB de espacio libre + espacio para datos MongoDB
- Atlas limita replica sets individuales a 4 TB en tiers altos
- Pipeline stages requieren más de 100 MB por defecto antes de usar disco

**Rendimiento de I/O:**
- Discos lentos afectan dramáticamente el rendimiento
- SSD recomendado sobre HDD tradicional
- La replicación genera I/O adicional entre nodos

**En Replica Sets:**
- Cada miembro necesita almacenar la data completa
- Logs de operaciones (oplog) consumen espacio adicional
- Sincronización inicial requiere espacio temporal

### **Limitaciones de CPU**

**Procesamiento:**
- Clusters con sharding y aplicaciones de alto tráfico necesitan CPUs de alto rendimiento con más cores
- Los secundarios consumen CPU incluso sin lecturas directas (replicación)

**En Replica Sets:**
- CPU adicional para mantener sincronización
- Elecciones de primario consumen recursos de CPU
- Índices en múltiples nodos requieren más CPU total

### **Recomendaciones de Configuración:**

**Hardware Balanceado:**
```
Recomendado para Replica Set:
- RAM: 32-64 GB (más según working set)
- CPU: 8-16 cores con alta frecuencia
- Disco: SSD con alta IOPS
- Red: Baja latencia entre nodos
```

**Monitoreo Crítico:**
- Uso de RAM vs working set size
- I/O wait en discos
- CPU durante sincronización
- Latencia de red entre nodos

Las limitaciones de hardware en replica sets son **multiplicativas** ya que cada nodo debe tener recursos suficientes para manejar la carga completa en caso de failover.