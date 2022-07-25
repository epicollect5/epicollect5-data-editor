import Jumps from '../../src/utils/Jumps';
import ProjectModel from '../../src/models/ProjectModel';

jest.mock('../../src/models/ProjectModel');

describe('jumps utils test', () => {

    it('should return the correct newNextInputRef and newNextInputIndex when an input is jumped', () => {
        const jumps = new Jumps();

        // The radio input to test
        const radioInput = {
            max: null,
            min: null,
            ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a',
            type: 'radio',
            group: [],
            jumps: [
                {
                    to: 'END',
                    when: 'IS_NOT',
                    answer_ref: '59240ce469f8b'
                }
            ],
            regex: null,
            branch: [],
            verify: false,
            default: '59240ce469f8b',
            is_title: false,
            question: 'radio',
            uniqueness: 'none',
            is_required: false,
            datetime_format: null,
            possible_answers: [
                {
                    answer: 1,
                    answer_ref: '59240ce469f8b'
                },
                {
                    answer: 2,
                    answer_ref: '59240ce969f8c'
                },
                {
                    answer: 3,
                    answer_ref: '59240ceb69f8d'
                }
            ],
            set_to_current_datetime: false
        };

        // Load Project Model
        ProjectModel.loadExtraStructure({
            forms: {
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329: {
                    group: [],
                    lists: {
                        location_inputs: [],
                        multiple_choice_inputs: {
                            form: {
                                order: [
                                    'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318'
                                ],
                                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318: {
                                    question: 'radio',
                                    possible_answers: {
                                        '59240d2d8c319': 1,
                                        '59240d318c31a': 2,
                                        '59240d338c31b': 3
                                    }
                                }
                            },
                            branch: {
                                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e: {
                                    order: [
                                        'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a'
                                    ],
                                    dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a: {
                                        question: 'radio',
                                        possible_answers: {
                                            '59240ce469f8b': 1,
                                            '59240ce969f8c': 2,
                                            ' 59240ceb69f8d': 3
                                        }
                                    }
                                }
                            }
                        }
                    },
                    branch: {
                        dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e: [
                            'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a',
                            'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f'
                        ]
                    },
                    inputs: [
                        'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e',
                        'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318',
                        'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d3e8c31c'
                    ],
                    details: {
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329',
                        name: 'form1',
                        slug: 'form1',
                        type: 'hierarchy',
                        inputs: [
                            {
                                max: null,
                                min: null,
                                ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e',
                                type: 'branch',
                                group: [],
                                jumps: [],
                                regex: null,
                                branch: [
                                    // The radio input to test
                                    radioInput,
                                    {
                                        max: null,
                                        min: null,
                                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f',
                                        type: 'text',
                                        group: [],
                                        jumps: [],
                                        regex: null,
                                        branch: [],
                                        verify: false,
                                        default: null,
                                        is_title: false,
                                        question: 'text',
                                        uniqueness: 'none',
                                        is_required: false,
                                        datetime_format: null,
                                        possible_answers: [],
                                        set_to_current_datetime: false
                                    }
                                ],
                                verify: false,
                                default: null,
                                is_title: false,
                                question: 'branch',
                                uniqueness: 'none',
                                is_required: false,
                                datetime_format: null,
                                possible_answers: [],
                                set_to_current_datetime: false
                            },
                            {
                                max: null,
                                min: null,
                                ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318',
                                type: 'radio',
                                group: [],
                                jumps: [
                                    {
                                        to: 'END',
                                        when: 'IS_NOT',
                                        answer_ref: '59240d2d8c319'
                                    }
                                ],
                                regex: null,
                                branch: [],
                                verify: false,
                                default: '59240d2d8c319',
                                is_title: false,
                                question: 'radio',
                                uniqueness: 'none',
                                is_required: false,
                                datetime_format: null,
                                possible_answers: [
                                    {
                                        answer: 1,
                                        answer_ref: '59240d2d8c319'
                                    },
                                    {
                                        answer: 2,
                                        answer_ref: '59240d318c31a'
                                    },
                                    {
                                        answer: 3,
                                        answer_ref: '59240d338c31b'
                                    }
                                ],
                                set_to_current_datetime: false
                            },
                            {
                                max: null,
                                min: null,
                                ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d3e8c31c',
                                type: 'text',
                                group: [],
                                jumps: [],
                                regex: null,
                                branch: [],
                                verify: false,
                                default: null,
                                is_title: false,
                                question: 'test',
                                uniqueness: 'none',
                                is_required: false,
                                datetime_format: null,
                                possible_answers: [],
                                set_to_current_datetime: false
                            }
                        ],
                        has_location: false
                    }
                }
            },
            inputs: {
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e: {
                    data: {
                        max: null,
                        min: null,
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e',
                        type: 'branch',
                        group: [],
                        jumps: [],
                        regex: null,
                        branch: [],
                        verify: false,
                        default: null,
                        is_title: false,
                        question: 'branch',
                        uniqueness: 'none',
                        is_required: false,
                        datetime_format: null,
                        possible_answers: [],
                        set_to_current_datetime: false
                    }
                },
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318: {
                    data: {
                        max: null,
                        min: null,
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d2d8c318',
                        type: 'radio',
                        group: [],
                        jumps: [
                            {
                                to: 'END',
                                when: 'IS_NOT',
                                answer_ref: '59240d2d8c319'
                            }
                        ],
                        regex: null,
                        branch: [],
                        verify: false,
                        default: '59240d2d8c319',
                        is_title: false,
                        question: 'radio',
                        uniqueness: 'none',
                        is_required: false,
                        datetime_format: null,
                        possible_answers: [
                            {
                                answer: 1,
                                answer_ref: '59240d2d8c319'
                            },
                            {
                                answer: 2,
                                answer_ref: '59240d318c31a'
                            },
                            {
                                answer: 3,
                                answer_ref: '59240d338c31b'
                            }
                        ],
                        set_to_current_datetime: false
                    }
                },
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d3e8c31c: {
                    data: {
                        max: null,
                        min: null,
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240d3e8c31c',
                        type: 'text',
                        group: [],
                        jumps: [],
                        regex: null,
                        branch: [],
                        verify: false,
                        default: null,
                        is_title: false,
                        question: 'test',
                        uniqueness: 'none',
                        is_required: false,
                        datetime_format: null,
                        possible_answers: [],
                        set_to_current_datetime: false
                    }
                },
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f: {
                    data: {
                        max: null,
                        min: null,
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f',
                        type: 'text',
                        group: [],
                        jumps: [],
                        regex: null,
                        branch: [],
                        verify: false,
                        default: null,
                        is_title: false,
                        question: 'text',
                        uniqueness: 'none',
                        is_required: false,
                        datetime_format: null,
                        possible_answers: [],
                        set_to_current_datetime: false
                    }
                },
                dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a: {
                    data: {
                        max: null,
                        min: null,
                        ref: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240ce469f8a',
                        type: 'radio',
                        group: [],
                        jumps: [
                            {
                                to: 'END',
                                when: 'IS_NOT',
                                answer_ref: '59240ce469f8b'
                            }
                        ],
                        regex: null,
                        branch: [],
                        verify: false,
                        default: '59240e469f8b',
                        is_title: false,
                        question: 'radio',
                        uniqueness: 'none',
                        is_required: false,
                        datetime_format: null,
                        possible_answers: [
                            {
                                answer: 1,
                                answer_ref: '59240ce469f8b'
                            },
                            {
                                answer: 2,
                                answer_ref: '59240ce969f8c'
                            },
                            {
                                answer: 3,
                                answer_ref: '59240ceb69f8d'
                            }
                        ],
                        set_to_current_datetime: false
                    }
                }
            },
            project: {
                forms: [
                    'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329'
                ],
                details: {
                    ref: 'dd1cf46d9f394977a2949ca05e08de0a',
                    name: 'branch jump test',
                    slug: 'branch-jump-test',
                    access: 'public',
                    status: 'active',
                    category: 'general',
                    logo_url: '',
                    visibility: 'hidden',
                    description: '',
                    small_description: 'testing jumps in a branch'
                },
                entries_limits: []
            }
        });

        expect(jumps.jumpNext({
            project: ProjectModel,
            formRef: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329',
            // Radio answer which will trigger a 'jump'
            answer: '59240ce969f8c',
            // The radio input to test
            input: radioInput,
            // The input details of the very next input
            nextInputRef: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e_59240b27cf88f',
            nextInputIndex: 1,
            ownerInputRef: 'dd1cf46d9f394977a2949ca05e08de0a_592408bab4329_59240b21cf88e',
            isBranch: true
        })).toEqual({ newNextInputRef: null, newNextInputIndex: 2 });
    });


});
