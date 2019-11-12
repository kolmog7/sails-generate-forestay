const path = require('path')
const viewBase = path.join(__dirname, '../..', 'views', 'forestay')
const defaultLayout = viewBase + '/layout.ejs'
var helpers = require("./../helpers/helpers")

module.exports = function(forestay, req, res) {
    forestay.model.find({
        id: forestay.id
    }).limit(1).exec(function(err, record) {
        if (err) res.serverError(err)
        if (record.length === 0) return res.send('record not found')

        helpers.populateOne(req, res, forestay, function(err, forestay) {
            if (err) return res.serverError(err)

            forestay.config.forestay.createUpdate.attributeGroups = helpers.getFieldsInGroups(req, res, forestay);

            record = record[0]
            if (typeof _.get(forestay.config.forestay, ['createUpdate', 'beforeUpdateCreateView']) === 'function') {
                forestay.config.forestay.createUpdate.beforeUpdateCreateView(req, res, forestay, function(err, forestay) {
                    if (err) res.serverError(err)
                    res.view(viewBase + '/createUpdate.ejs', {
                        layout: _.get(forestay.localConfig, ['defaultLayout']) || defaultLayout,
                        forestay,
                        record
                    })
                })
            } else {
                res.view(viewBase + '/createUpdate.ejs', {
                    layout: _.get(forestay.localConfig, ['defaultLayout']) || defaultLayout,
                    forestay,
                    record
                })
            }
        })
    })
}
