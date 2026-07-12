const ShowModal = ({
    department,
    onClose
}) => {

    if(!department) return null;

    return (

    <div className="modal-overlay">


        <div className="department-modal show-modal">


            <div className="modal-header">


                <h3>
                    🏢 Department Detail
                </h3>



                <button

                className="close-btn"

                onClick={onClose}

                >

                    ✖

                </button>


            </div>





            <div className="department-detail">



                <div className="detail-row">

                    <strong>
                        Department Code
                    </strong>


                    <span>
                        {department.department_code}
                    </span>


                </div>






                <div className="detail-row">

                    <strong>
                        Khmer Name
                    </strong>


                    <span>
                        {
                        department.department_name_khmer
                        }
                    </span>


                </div>







                <div className="detail-row">

                    <strong>
                        English Name
                    </strong>


                    <span>
                        {
                        department.department_name_english
                        }
                    </span>


                </div>








                <div className="detail-row">

                    <strong>
                        Description
                    </strong>


                    <span>

                    {
                    department.description
                    ||
                    "No description"
                    }

                    </span>


                </div>







                <div className="detail-row">

                    <strong>
                        Total Students
                    </strong>


                    <span className="count-badge">

                    {
                    department.students_count ?? 0
                    }

                    </span>


                </div>








                <div className="detail-row">

                    <strong>
                        Total Courses
                    </strong>


                    <span className="count-badge">

                    {
                    department.courses_count ?? 0
                    }

                    </span>


                </div>








                <div className="detail-row">

                    <strong>
                        Total Classes
                    </strong>


                    <span className="count-badge">

                    {
                    department.classes_count ?? 0
                    }

                    </span>


                </div>









                <div className="detail-row">

                    <strong>
                        Status
                    </strong>


                    {

                    department.status

                    ?

                    <span className="active-status">

                        Active

                    </span>


                    :

                    <span className="inactive-status">

                        Inactive

                    </span>


                    }


                </div>






            </div>







            <div className="modal-footer">


                <button

                className="cancel-btn"

                onClick={onClose}

                >

                    Close

                </button>



            </div>





        </div>


    </div>


    );


};


export default ShowModal;