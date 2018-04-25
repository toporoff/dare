const notFound = (req, res) => {
    res.status(404).send('wrong api call');
}

module.exports = notFound;