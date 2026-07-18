import "./Filter.css";

const Filter = ({
  academicYears = [],
  semesters = [],
  academicYearId,
  semesterId,
  setAcademicYearId,
  setSemesterId,
  onSearch,
}) => {
  const handleReset = () => {
    setAcademicYearId("");

    setSemesterId("");

    onSearch("", "");
  };

  return (
    <div className="classroom-filter">
      {/* Academic Year */}

      <div className="filter-group">
        <label>Academic Year</label>

        <select
          className="form-select"
          value={academicYearId}
          onChange={(e) => setAcademicYearId(e.target.value)}
        >
          <option value="">All Academic Years</option>

          {academicYears.map((year) => (
            <option key={year.id} value={year.id}>
              {year.academic_year}
            </option>
          ))}
        </select>
      </div>

      {/* Semester */}

      <div className="filter-group">
        <label>Semester</label>

        <select
          className="form-select"
          value={semesterId}
          onChange={(e) => setSemesterId(e.target.value)}
        >
          <option value="">All Semesters</option>

          {semesters.map((semester) => (
            <option key={semester.id} value={semester.id}>
              {semester.semester_name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}

      <div className="filter-actions">
        <button className="btn btn-primary" onClick={onSearch}>
          🔍 Search
        </button>

        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Filter;
