import { Link } from "react-router-dom";
import logo from "./assets/logo.png";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { XCircle } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parseISO } from "date-fns";
import { useState } from "react";

type Log = {
  id: string;
  date: string;
  foodInput: string[];
  alcohol: boolean;
  bowelMovements: string;
  stress: number;
  pain: boolean;
  nausea: boolean;
};

function AddLog() {
  const [foodItems, setFoodItems] = useState<string[]>([]); // State to hold the list of food items
  const [currentFoodItem, setCurrentFoodItem] = useState(""); // State to hold the current input value
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<Log>({
    defaultValues: {
      alcohol: false,
      pain: false,
      nausea: false,
      stress: 1,
      foodInput: [],
    },
  });

  const handleAddFoodItem = () => {
    if (currentFoodItem) {
      setFoodItems([...foodItems, currentFoodItem]);
      setCurrentFoodItem(""); // Clear the input after adding
    }
  };

  const onSubmit: SubmitHandler<Log> = async (data: Log) => {
    const finalData = {
      ...data,
      foodInput: foodItems,
    };
    console.log("Submitting data:", finalData);

    try {
      const response = await fetch("http://localhost:3000/add-log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });

      console.log("Response status:", response.status); // Log the response status

      if (!response.ok) {
        throw new Error("Response not ok");
      }

      reset({
        // Reset form fields to default values
        alcohol: false,
        pain: false,
        nausea: false,
        stress: 1,
        foodInput: [],
      });
      setFoodItems([]); // Clear the food items list

      console.log("Form and food items reset after submission");
      setSubmissionSuccess(true); // Set submission success state to true
      setTimeout(() => setSubmissionSuccess(false), 5000); // Optionally, hide the message after 5 seconds
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionSuccess(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submit behavior
      handleAddFoodItem();
    }
  };
  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link to={"/"}>
            <img src={logo} className="btn btn-ghost" />
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={"/logs"} className="text-xl">
                Logs
              </Link>
            </li>
            <li>
              <Link to={"/rapports"} className="text-xl">
                Rapports
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between m-10">
        <h1 className="text-3xl">Add log</h1>
        <Link to={"/logs"}>
          <XCircle size={34} />
        </Link>
      </div>
      <div className="flex justify-center h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Controller
            control={control}
            name="date"
            rules={{ required: "Date is required" }} // Add validation rules here
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <>
                <DatePicker
                  className="select select-bordered w-full max-w-xs"
                  placeholderText="Select date"
                  onChange={(date) =>
                    onChange(date ? format(date, "yyyy-MM-dd") : "")
                  }
                  onBlur={onBlur}
                  selected={value ? parseISO(value) : null}
                  dateFormat="yyyy-MM-dd"
                />
                {error && <p className="text-red-500">{error.message}</p>}{" "}
                {/* Display error message */}
              </>
            )}
          />
          <div className="flex flex-col">
            <span className="label-text">Bowel Movements:</span>
            <select
              {...register("bowelMovements", { required: true })}
              className="select select-bordered w-full max-w-xs"
            >
              {errors.bowelMovements && "Bowel movement is required"}
              <option disabled value="">
                Bowel Movements:
              </option>
              <option value="Bloated">Bloated</option>
              <option value="Normal">Normal</option>
              <option value="Diarrhea">Diarrhea</option>
            </select>
          </div>
          <div className="flex flex-col">
            <div className="form-control w-52">
              <label className="cursor-pointer label">
                <span className="label-text">Alcohol</span>
                <input
                  {...register("alcohol")}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
              </label>
            </div>
            <div className="form-control w-52">
              <label className="cursor-pointer label">
                <span className="label-text">Pain</span>
                <input
                  {...register("pain")}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
              </label>
            </div>
            <div className="form-control w-52">
              <label className="cursor-pointer label">
                <span className="label-text">Nausea</span>
                <input
                  {...register("nausea")}
                  type="checkbox"
                  className="toggle toggle-primary"
                />
              </label>
            </div>
          </div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Stress Level:</span>
            </div>
            <select {...register("stress")} className="select select-bordered">
              <option disabled>Stress level:</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
              <option>6</option>
              <option>7</option>
              <option>8</option>
              <option>9</option>
              <option>10</option>
            </select>
          </label>
          <div className="form-control">
            <div className="label">
              <span className="label-text">What did you eat today?</span>
            </div>
            <div className="flex gap-2">
              <input
                value={currentFoodItem}
                onChange={(e) => setCurrentFoodItem(e.target.value)}
                onKeyDown={handleKeyPress}
                type="text"
                placeholder="Type here"
                className="input input-bordered"
              />
              <button
                type="button"
                onClick={handleAddFoodItem}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            <div className="form-control">
              <div className="flex gap-2 mb-4">
                {/* Existing input and button elements */}
              </div>
              <div className="space-y-2">
                {" "}
                {/* Vertical spacing between items */}
                {foodItems.map((item, index) => (
                  <div key={index} className="card bg-accent shadow-xl p-4">
                    {" "}
                    {/* Card style for each item */}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <input type="submit" className="btn btn-primary" />
          {submissionSuccess && (
            <div className="text-green-500 mt-2">Log added successfully!</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddLog;
