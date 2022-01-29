const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('src/_middleware/validate-request');
const authorize = require('src/_middleware/authorize');
const cvService = require('./cv.service');
const cvEmploymentRouter = require('./employment/employment.controller');
const cvEducationRouter = require('./education/education.controller');

// routes
router.get('/', authorize(true), getAll);
router.get('/owned', authorize(), getAllOwned);
router.post('/set', authorize(), setSchema, set);
router.get('/:cvId', getById);
router.put('/:cvId', authorize(), updateSchema, update);
router.delete('/:cvId', authorize(), _delete);

router.use('/:cvId/education', cvEducationRouter)
router.use('/:cvId/employment', cvEmploymentRouter)

module.exports = router;

function getAll(req, res, next) {
    cvService.getAll(req.user?.id)
        .then(cvs => res.json(cvs))
        .catch(next);
}

function getAllOwned(req, res, next) {
    cvService.getAllOwned(req.user?.id)
        .then(cvs => res.json(cvs))
        .catch(next);
}

function setSchema(req, res, next) {
    const schema = Joi.object({
        userId: Joi.number().required(),
        isPublished: Joi.boolean(),
    });
    validateRequest(req, next, schema);
}

function set(req, res, next) {
    cvService.set(req.body)
        .then((cv) => res.json(cv))
        .catch(next);
}

function getById(req, res, next) {
    cvService.getById(req.params.cvId, req.user?.id)
        .then(cv => res.json(cv))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        cvId: Joi.number(),
        isPublished: Joi.boolean(),
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    cvService.update(req.params.cvId, req.body)
        .then(cv => res.json(cv))
        .catch(next);
}

function _delete(req, res, next) {
    cvService.delete(req.params.cvId)
        .then(() => res.json({ message: 'CV deleted successfully' }))
        .catch(next);
}
