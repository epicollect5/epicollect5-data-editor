import EC5_LIBRARIES from 'ec5-libraries';

const JsonFormatter = EC5_LIBRARIES.JsonFormatter;

/**
 * Create a json object used in the api uniqueness check
 *
 * @param formRef
 * @param entry
 * @param inputRef
 * @param answer
 * @param projectVersion
 * @returns {{id: *, type: *, attributes: {form: {ref: *, type: string}}, relationships: {parent: {}, branch: {}}}}
 */
JsonFormatter.makeJsonUniqueEntry = function (formRef, entry, inputRef, answer, projectVersion) {

    const relationships = {
        parent: {},
        branch: {}
    };

    if (entry.relationships.parent && entry.relationships.parent.data) {
        relationships.parent = {
            data: {
                parent_form_ref: entry.relationships.parent.data.parent_form_ref,
                parent_entry_uuid: entry.relationships.parent.data.parent_entry_uuid
            }
        };
    }

    if (entry.relationships.branch && entry.relationships.branch.data) {
        relationships.branch = {
            data: {
                owner_input_ref: entry.relationships.branch.data.owner_input_ref,
                owner_entry_uuid: entry.relationships.branch.data.owner_entry_uuid
            }
        };
    }

    return {
        id: entry.id,
        type: entry.type,
        attributes: {
            form: {
                ref: formRef,
                type: 'hierarchy'
            }
        },
        relationships,
        [entry.type]: {
            entry_uuid: entry.id,
            input_ref: inputRef,
            answer,
            project_version: projectVersion
        }
    };


};

export default JsonFormatter;
