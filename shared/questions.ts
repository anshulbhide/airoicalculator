
export const questions = {
  dataInfrastructure: [
    {
      id: "centralizedData",
      text: "Do you have a centralized data repository?",
      options: [
        { value: "1", label: "No centralized data storage" },
        { value: "2", label: "Some data is centralized" },
        { value: "3", label: "Most data is centralized" },
        { value: "4", label: "Fully centralized data infrastructure" },
      ],
    },
    {
      id: "dataQuality",
      text: "How clean and integrated is your customer data?",
      options: [
        { value: "1", label: "Data is scattered and inconsistent" },
        { value: "2", label: "Basic data organization" },
        { value: "3", label: "Well-organized with some integration" },
        { value: "4", label: "Fully integrated and maintained" },
      ],
    },
  ],
  processAutomation: [
    {
      id: "manualTasks",
      text: "Which manual tasks would benefit from automation?",
      options: [
        { value: "1", label: "Most tasks are manual" },
        { value: "2", label: "Some basic automation" },
        { value: "3", label: "Significant automation in place" },
        { value: "4", label: "Highly automated processes" },
      ],
    },
    {
      id: "workflows",
      text: "Do you have standardized workflows?",
      options: [
        { value: "1", label: "No standardized workflows" },
        { value: "2", label: "Some workflows documented" },
        { value: "3", label: "Most workflows standardized" },
        { value: "4", label: "Fully standardized and optimized" },
      ],
    },
  ],
  techCapabilities: [
    {
      id: "digitalTools",
      text: "What percentage of your processes are supported by digital tools?",
      options: [
        { value: "1", label: "Less than 25%" },
        { value: "2", label: "25-50%" },
        { value: "3", label: "50-75%" },
        { value: "4", label: "Over 75%" },
      ],
    },
    {
      id: "apiIntegration",
      text: "Do you leverage APIs and modern integrations?",
      options: [
        { value: "1", label: "No API usage" },
        { value: "2", label: "Limited API integration" },
        { value: "3", label: "Multiple API integrations" },
        { value: "4", label: "Extensive API ecosystem" },
      ],
    },
  ],
};
