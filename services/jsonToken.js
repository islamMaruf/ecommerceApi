const jwt = require("jsonwebtoken");
exports.generateJsonToken = function (user, req, res) {
  try {
    //generate a signed _token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expires: new Date(Date.now() + 900000) });
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  } catch (err) {
    return res.json({
      err: err,
    });
  }
};
