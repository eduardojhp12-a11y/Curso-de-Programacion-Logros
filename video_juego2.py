def aventura():
    print("Estás caminando por un bosque oscuro...")
    print("Encuentras dos objetos: un FÓSFORO y una LINTERNA.")
    eleccion1 = input("¿Con cuál te quedas?: ").lower()

    if eleccion1 == "fosforo":
        print("Coges el fósforo y lo enciendes. Por un instante, el bosque se ilumina...")
        print("¡Un gran oso grizzly aparece frente a ti!")
        print("¿Quieres CORRER o ESCONDERTE detrás de un árbol?")
        eleccion2 = input("Que eligen: ").lower()

        if eleccion2 == "correr":
            print("Corres desesperadamente, pero el oso te persigue.")
            print("Encuentras un río frente a ti. ¿Quieres NADAR, SALTAR al otro lado o GRITAR para pedir ayuda?")
            eleccion3 = input("Que eligen: ").lower()

            if eleccion3 == "nadar":
                print("Te lanzas al río, pero la corriente es fuerte...")
                print("¿Quieres LUCHAR contra la corriente o DEJARTE llevar?")
                eleccion4 = input("Que eligen: ").lower()

                if eleccion4 == "luchar":
                    print("Logras llegar a la orilla, exhausto pero vivo. ¡Has sobrevivido al oso!")
                elif eleccion4 == "dejarte llevar":
                    print("La corriente te arrastra a una cascada... ¡Fin de la aventura!")
                else:
                    print("Opción no válida. Intenta de nuevo.")

            elif eleccion3 == "saltar":
                print("Saltas con todas tus fuerzas...")
                print("¡Lo logras! El oso no puede seguirte. Encuentras una cabaña misteriosa.")
                print("¿Quieres ENTRAR, TOCAR la puerta o IGNORAR la cabaña?")
                eleccion4 = input("Que eligen: ").lower()

                if eleccion4 == "entrar":
                    print("Dentro encuentras provisiones y un mapa. ¡Has encontrado refugio seguro!")
                elif eleccion4 == "tocar":
                    print("Un anciano abre la puerta y te ofrece ayuda. ¡Final feliz!")
                elif eleccion4 == "ignorar":
                    print("Sigues caminando, pero pronto te pierdes en el bosque... ¡Fin de la aventura!")
                else:
                    print("Opción no válida. Intenta de nuevo.")

            elif eleccion3 == "gritar":
                print("Gritas con todas tus fuerzas...")
                print("Un grupo de cazadores aparece y ahuyenta al oso. ¡Estás a salvo!")
            else:
                print("Opción no válida. Intenta de nuevo.")

        elif eleccion2 == "esconderte":
            print("Te escondes detrás de un árbol. El oso olfatea y se aleja.")
            print("Encuentras un cofre enterrado. ¿Quieres ABRIRLO, DEJARLO o ROMPERLO?")
            eleccion3 = input("Que eligen: ").lower()

            if eleccion3 == "abrirlo":
                print("Dentro hay joyas mágicas. ¡Has encontrado un tesoro!")
            elif eleccion3 == "dejarlo":
                print("Decides no arriesgarte y sigues tu camino. El bosque se calma.")
            elif eleccion3 == "romperlo":
                print("El cofre explota y te lanza lejos... ¡Fin de la aventura!")
            else:
                print("Opción no válida. Intenta de nuevo.")
        else:
            print("Opción no válida. Intenta de nuevo.")

    elif eleccion1 == "linterna":
        print("Enciendes la linterna y ves un camino iluminado.")
        print("De pronto, oyes algo entre los árboles.")
        print("¿Quieres SEGUIR el camino o BUSCAR entre los árboles?")
        eleccion2 = input("Que eligen: ").lower()

        if eleccion2 == "seguir":
            print("Sigues el camino y llegas a una encrucijada.")
            print("¿Quieres IR a la IZQUIERDA, DERECHA o REGRESAR?")
            eleccion3 = input("Que eligen: ").lower()

            if eleccion3 == "izquierda":
                print("Llegas a un claro iluminado por la luna. Encuentras paz y seguridad.")
            elif eleccion3 == "derecha":
                print("Caíste en una trampa oculta... ¡Fin de la aventura!")
            elif eleccion3 == "regresar":
                print("Vuelves atrás y el camino desaparece misteriosamente. ¡Estás atrapado!")
            else:
                print("Opción no válida. Intenta de nuevo.")

        elif eleccion2 == "buscar":
            print("Te adentras entre los árboles...")
            print("Encuentras una criatura mágica que te ofrece tres regalos.")
            print("¿Quieres la ESPADA, el ESCUDO o la POCIÓN?")
            eleccion3 = input("Que eligen: ").lower()

            if eleccion3 == "espada":
                print("Con la espada derrotas a cualquier amenaza. ¡Eres el héroe del bosque!")
            elif eleccion3 == "escudo":
                print("El escudo te protege de todo peligro. ¡Has ganado seguridad eterna!")
            elif eleccion3 == "poción":
                print("La poción te da poderes mágicos. ¡Tu aventura apenas comienza!")
            else:
                print("Opción no válida. Intenta de nuevo.")
        else:
            print("Opción no válida. Intenta de nuevo.")

    else:
        print("Opción no válida. Intenta de nuevo.")
aventura()