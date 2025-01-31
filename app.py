from flask import Flask, render_template, request, redirect, url_for, flash, session as flask_session
from database import session, Usuario
import logging
import os
logging.basicConfig(level=logging.DEBUG)
from database import session, Usuario, Personaje

app = Flask(__name__)
app.secret_key = "tu_clave_secreta"

@app.route("/")
def index():
    return redirect(url_for("login"))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        nombre_usuario = request.form["nombre_usuario"]
        contraseña = request.form["contraseña"]
        
        usuario = session.query(Usuario).filter_by(nombre_usuario=nombre_usuario).first()
        
        if usuario is None:
            flash("Usuario no encontrado", "error")
        elif usuario.contraseña != contraseña:
            flash("Contraseña incorrecta", "error")
        else:
            flash("Inicio de sesión exitoso", "success")
            flask_session['usuario'] = usuario.nombre_usuario  # Guardar el usuario en la sesión
            return redirect(url_for("dashboard"))  # Redirigir al dashboard

    return render_template("login.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        nombre_usuario = request.form["nombre_usuario"]
        contraseña = request.form["contraseña"]

        usuario_existente = session.query(Usuario).filter_by(nombre_usuario=nombre_usuario).first()

        if usuario_existente:
            flash("El usuario ya existe. Intenta con otro nombre.", "error")
        else:
            nuevo_usuario = Usuario(nombre_usuario=nombre_usuario, contraseña=contraseña)
            session.add(nuevo_usuario)
            session.commit()
            flash("Registro exitoso. Inicia sesión.", "success")
            return redirect(url_for("login"))

    return render_template("register.html")

@app.route('/dashboard')
def dashboard():
    if 'usuario' not in flask_session:  # Verificar si el usuario está en la sesión
        return redirect(url_for('login'))  # Redirigir al login si no hay usuario en la sesión
    
    usuario = session.query(Usuario).filter_by(nombre_usuario=flask_session['usuario']).first()
    saved_selection = {}
    
    if usuario and usuario.personajes:
        try:
            # Parseamos las selecciones guardadas del usuario
            saved_selection = {
                slot: {"itemName": item.split(":")[0], "itemImage": item.split(":")[1]}
                for slot, item in (pair.split("|") for pair in usuario.personajes.split(";") if pair)
            }
        except Exception as e:
            print(f"Error al cargar configuración: {e}")

    return render_template("base.html", saved_selection=saved_selection)

@app.route('/logout')
def logout():
    flask_session.pop('usuario', None)  # Eliminar al usuario de la sesión
    flash('Has cerrado sesión', 'info')
    return redirect(url_for('login'))

# app.py

@app.route('/save_character', methods=['POST'])
def save_character():
    if 'usuario' not in flask_session:
        return {"success": False, "message": "Usuario no autenticado"}, 401

    data = request.json
    if not data or 'name' not in data:
        return {"success": False, "message": "Datos incompletos"}, 400

    try:
        usuario = session.query(Usuario).filter_by(nombre_usuario=flask_session['usuario']).first()

        if not usuario:
            return {"success": False, "message": "Usuario no encontrado"}, 404

        # Crear un nuevo personaje y asignarlo al usuario
        nuevo_personaje = Personaje(
            name=data['name'],
            Weapon1=data.get('weapon1', {}).get('itemName', ''),
            Weapon2=data.get('weapon2', {}).get('itemName', ''),
            Shield=data.get('shield', {}).get('itemName', ''),
            Talisman=data.get('amulet', {}).get('itemName', ''),
            Helmet=data.get('helmet', {}).get('itemName', ''),
            Chest=data.get('chest', {}).get('itemName', ''),
            Gauntlets=data.get('gloves', {}).get('itemName', ''),
            Legs=data.get('legs', {}).get('itemName', ''),
            # Guardar las imágenes de cada pieza del equipo
            Weapon1Image=data.get('weapon1', {}).get('itemImage', ''),
            Weapon2Image=data.get('weapon2', {}).get('itemImage', ''),
            ShieldImage=data.get('shield', {}).get('itemImage', ''),
            TalismanImage=data.get('amulet', {}).get('itemImage', ''),
            HelmetImage=data.get('helmet', {}).get('itemImage', ''),
            ChestImage=data.get('chest', {}).get('itemImage', ''),
            GauntletsImage=data.get('gloves', {}).get('itemImage', ''),
            LegsImage=data.get('legs', {}).get('itemImage', ''),
            photo=data.get('helmet', {}).get('itemImage', ''),  # Usa la imagen del casco como foto principal
            usuario=usuario
        )

        # Añadir el personaje a la relación del usuario
        session.add(nuevo_personaje)
        session.commit()

        return {"success": True}, 200

    except Exception as e:
        app.logger.error(f"Error al guardar el personaje: {str(e)}")
        return {"success": False, "message": f"Error interno del servidor: {str(e)}"}, 500


@app.route('/characters')
def characters():
    if 'usuario' not in flask_session:
        return redirect(url_for('login'))

    usuario = session.query(Usuario).filter_by(nombre_usuario=flask_session['usuario']).first()
    if not usuario:
        flash("Usuario no encontrado", "error")
        return redirect(url_for('login'))

    # Obtener los personajes del usuario
    characters = [
        {
            "name": personaje.name,
            "photo": personaje.photo,
            "Weapon1": personaje.Weapon1,
            "Weapon2": personaje.Weapon2,
            "Shield": personaje.Shield,
            "Talisman": personaje.Talisman,
            "Helmet": personaje.Helmet,
            "Chest": personaje.Chest,
            "Gauntlets": personaje.Gauntlets,
            "Legs": personaje.Legs,
            "Weapon1Image": personaje.Weapon1Image,  # Asegúrate de devolver las imágenes
            "Weapon2Image": personaje.Weapon2Image,
            "ShieldImage": personaje.ShieldImage,
            "TalismanImage": personaje.TalismanImage,
            "HelmetImage": personaje.HelmetImage,
            "ChestImage": personaje.ChestImage,
            "GauntletsImage": personaje.GauntletsImage,
            "LegsImage": personaje.LegsImage
        }
        for personaje in usuario.personajes
    ]

    return render_template('task/characters.html', characters=characters)



if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Railway asigna dinámicamente el puerto
    app.run(host="0.0.0.0", port=port, debug=True)
