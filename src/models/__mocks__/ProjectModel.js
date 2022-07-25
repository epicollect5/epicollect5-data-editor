import EC5_LIBRARIES from 'ec5-libraries';

const ProjectModel = EC5_LIBRARIES.ProjectModel;

ProjectModel.setStructureLastUpdated = function (date) {
    this.structure_last_updated = date;
};

ProjectModel.getStructureLastUpdated = function () {
    return this.structure_last_updated;
};

ProjectModel.formExists = function (formRef) {
    return this.project_extra.forms[formRef] ? true : false;
};

ProjectModel.getEntryLimit = function (ref) {
    // If we have an entry limit set for this ref
    if (typeof this.project_extra.project.entries_limits !== 'undefined' &&
        typeof this.project_extra.project.entries_limits[ref] !== 'undefined') {
        return parseInt(this.project_extra.project.entries_limits[ref], 10);
    }
    return null;
};

export default ProjectModel;
