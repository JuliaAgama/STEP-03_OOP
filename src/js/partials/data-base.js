function getDoctors (){
    return [
        {
            type: "cardiologist",
            fields: [
                {
                    name: "Normal pressure",
                    type: "text",
                    id: "pressure",
                    required: true
                },
                {
                    name: "Body mass index",
                    type: "text",
                    id: "massIndex",
                    required: true
                },
                {
                    name: "Past diseases of the cardiovascular system",
                    type: "text",
                    id: "pastDiseases",
                    required: true
                },
                {
                    name: "Age",
                    type: "text",
                    id: "age",
                    required: true
                }
            ]
        },
        {
            type: "dentist",
            fields: [
                {
                    name: "Date last visited",
                    type: "date",
                    id: "lastVisited",
                    required: true
                }
            ]
        },
        {
            type: "therapist",
            fields: [
                {
                    name: "Age",
                    type: "text",
                    id: "age",
                    required: true
                }
            ]
        }
    ];
}