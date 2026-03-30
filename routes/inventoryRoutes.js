
router.get("/detail/:inv_id", invController.buildDetailView)
router.get("/trigger-error", invController.triggerError)