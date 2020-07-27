import fillCrudMetadataGaps from 'devcase-crud/dist/fillCrudMetadataGaps'
import authorization from '../../util/authorization'
import orderItem from '../orderItem'

export default fillCrudMetadataGaps({
    label: 'Viagem',
    labelPlural: 'Viagens',
    name: 'Order',
    faIcon: 'file-invoice',
    insertable: false,
    updatable: true,
    deletable: false,
    authorization: authorization('clientConsultant'),
    'custom:sortFields': ['date desc'],
    columnNames: [
        'id',
        'description',
        'clientName',
        'requesterName',
        'status',
        'startDate',
        'endDate',
        'travellerName',
        'date',
        'isForGroups',
    ],
    fields: [
        {
            label: 'Id',
            name: 'id',
            type: 'text',
            updatable: false,
            insertable: false,
            id: true,
            renderColumn: false,
        },
        {
            name: 'clientId',
            label: 'Id Cliente',
            updatable: false,
        },
        {
            name: 'clientName',
            label: 'Nome do cliente',
            updatable: false,
        },
        {
            name: 'travellerName',
            label: 'Nome do viajante',
            updatable: false,
        },
        {
            name: 'travellerFirstName',
            label: 'Primeiro nome',
            updatable: false,
            render: false,
        },
        {
            name: 'travellerLastName',
            label: 'Sobrenome',
            updatable: false,
            render: false,
        },
        {
            name: 'travellerId',
            label: 'Id do viajante',
            updatable: false,
        },
        {
            name: 'date',
            label: 'Data da reserva',
            type: 'datetime',
            updatable: false,
        },
        {
            label: 'Data de início',
            name: 'startDate',
            type: 'date',
            updatable: false,
        },
        {
            label: 'Data de fim',
            name: 'endDate',
            type: 'date',
            updatable: false,
        },
        {
            name: 'timeoutTimestamp',
            label: 'Validade',
            type: 'datetime',
            updatable: false,
        },
        {
            name: 'requesterName',
            label: 'Nome do solicitante',
            updatable: false,
        },
        {
            name: 'requesterEmail',
            label: 'E-mail do solicitante',
            updatable: false,
        },
        {
            name: 'requesterId',
            label: 'Id do solicitante',
            updatable: false,
        },
        {
            name: 'requesterType',
            label: 'Tipo de solicitante',
            options: [
                { label: 'Usuário da agência', value: 'user' },
                { label: 'Usuário do cliente', value: 'clientTraveller' },
            ],
            updatable: false,
        },
        {
            name: 'createdBy',
            label: 'Criado por',
            type: 'text',
            updatable: false,
        },
        {
            name: 'createdByName',
            label: 'Criado por',
            type: 'text',
            updatable: false,
        },
        {
            name: 'cancelled',
            label: 'Cancelado',
            type: 'boolean',
            updatable: false,
        },
        {
            name: 'cancellationDate',
            label: 'Cancelado em',
            type: 'datetime',
            updatable: false,
        },
        {
            name: 'status',
            label: 'Status',
            options: [
                { label: 'Criada', value: 'CREATED' },
                { label: 'Aguardando envio', value: 'PENDING' },
                { label: 'Rejeitado', value: 'REJECTED' },
                { label: 'Enviado', value: 'AWAITING_APPROVAL' },
                { label: 'Cancelado', value: 'CANCELLED' },
                { label: 'Não aprovado no prazo', value: 'CANCELLED_TIMEOUT' },
                { label: 'Aprovado', value: 'APPROVED' },
                { label: 'Confirmado', value: 'CONFIRMED' },
            ],
            renderStyle(i, fieldName = 'status') {
                if (i[fieldName]) {
                    switch (i[fieldName]) {
                        case 'CANCELLED_TIMEOUT':
                        case 'CANCELLED':
                        case 'REJECTED':
                            return 'danger'
                        case 'PENDING':
                            return 'warning'
                        case 'AWAITING_APPROVAL':
                        case 'CONFIRMED':
                        case 'APPROVED':
                            return 'success'
                    }
                }
                if (i.cancelled) return 'danger'
                return 'warning'
            },
            updatable: false,
        },
        {
            name: 'tags',
            label: 'Marcadores',
            type: 'textarray',
            updatable: false,
        },
        {
            name: 'autoSubmitDisabled',
            label: 'Envio automático desabilitado',
            type: 'boolean',
            updatable: true,
            render: false,
        },
        {
            name: 'items',
            label: 'Itens',
            graphQLType: '[NestedOrderItem]',
            updatable: false,
            insertable: false,
            type: 'objectarray',
            fields: orderItem.fields,
        },
        {
            name: 'isForGroups',
            label: 'Reserva para grupos',
            type: 'boolean',
            updatable: false,
            renderColumn: false,
        },
        {
            name: 'description',
            label: 'Descrição',
            type: 'text',
            renderColumn: function(i) {
                if (!i.description) {
                    if (i.isForGroups) {
                        return `Reserva para grupos ${i.id}`
                    } else {
                        return `Viagem ${i.id}`
                    }
                }
                return i.description
            },
        },
        {
            name: 'destinationName',
            label: 'Destino',
        },
        {
            name: 'destinationPosition',
            label: 'Destino (posição)',
            type: 'floatarray',
        },
    ],
    filter: [
        {
            name: 'clientId_eq',
            field: 'clientId',
            op: 'eq',
            label: 'Client Id',
        },
        {
            name: 'travellerId_eq',
            field: 'travellerId',
            op: 'eq',
            label: 'Traveller Id',
        },
        {
            name: 'date_ge',
            field: 'date',
            op: 'ge',
            label: 'Data de Reserva Início',
        },
        {
            name: 'date_le',
            field: 'date',
            op: 'le',
            label: 'Data de Reserva Fim',
        },
        {
            name: 'startDate_ge',
            field: 'startDate',
            op: 'ge',
            label: 'Início da viagem maior que',
        },
        {
            name: 'startDate_le',
            field: 'startDate',
            op: 'le',
            label: 'Início da viagem menor que',
        },
        {
            name: 'endDate_ge',
            field: 'endDate',
            op: 'ge',
            label: 'Fim da viagem maior que',
        },
        {
            name: 'cancelled_ne',
            field: 'cancelled',
            op: 'ne',
            label: 'Cancelado diferente de',
        },
        {
            name: 'isForGroups_eq',
            field: 'isForGroups',
            op: 'eq',
        },
        {
            name: 'isForGroups_ne',
            field: 'isForGroups',
            op: 'ne',
        },
    ],
})
