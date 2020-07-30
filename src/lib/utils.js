module.exports = {
    formatPrice(price) {
        price = String(price).replace(/\D/g, "")
        return new Intl.NumberFormat('en-US', {
            style: "currency",
            currency: "USD"
        }).format(price/100)
    },
    dateFormatted(timestamp) {
        const date = new Date(timestamp)

        const year = date.getFullYear()
        const month = Number(date.getMonth()) + 1
        const day = date.getDate()

        return {
            iso: `${year}-${month}-${day}`,
            brasil: `${day}/${month}/${year}`
        }

    },
    formatCpfCnpj(value) {
        value = value.replace(/\D/g, "")

        // check if the value is cpf or cnpj
        if (value.length > 11) {
            // cnpj
            value = value.replace(/(\d{2})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value.replace(/(\d{3})(\d)/, "$1/$2")
            value = value.replace(/(\d{4})(\d)/, "$1-$2")
            
        } else {
            // cpf
            value = value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value = value.replace(/(\d{3})(\d)/, "$1.$2")
            value = value = value.replace(/(\d{3})(\d)/, "$1-$2")
        }

        return value
    },
    formatCep(value) {
        value = value.replace(/\D/g, "")
        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        return value
    }
}