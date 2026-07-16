const supabase = require("../config/supabase");

// Get all users
exports.getUsers = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};

// Get user by id
exports.getUser = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(404).json(error);
  }

  res.json(data);
};

// Create user
exports.createUser = async (req, res) => {
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email }])
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.status(201).json(data);
};

// Update user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const { data, error } = await supabase
    .from("users")
    .update({ name, email })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json(error);
  }

  res.json(data);
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", id);

  if (error) {
    return res.status(500).json(error);
  }

  res.json({
    message: "User deleted successfully",
  });
};