import React from "react";
import zxcvbn from "zxcvbn";

const PasswordStrengthBar = ({ password }) => {
  const testResult = zxcvbn(password);
  const score = testResult.score;
  const color = ["gray", "red", "orange", "yellow", "green"][score];
  const text = ["Very Weak", "Weak", "Fair", "Good", "Strong"][score];

  return (
    <div>
      <div
        style={{
          height: "6px",
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: "5px",
          marginTop: "5px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${(score + 1) * 20}%`,
            backgroundColor: color,
            borderRadius: "5px",
          }}
        ></div>
      </div>
      {password && <small style={{ color }}>{text}</small>}
    </div>
  );
};

export default PasswordStrengthBar;
