import { Exercise, ExerciseModule } from '../types';

export const BASE_EXERCISES: Exercise[] = [
  // ==========================================
  // WINDOWS (CMD / PowerShell)
  // ==========================================
  {
    id: 'win-01',
    title: 'Crear una carpeta básica',
    os: 'windows',
    module: 'Windows - Creación y Navegación',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: 'C:\\Users\\Alumno\\Desktop',
    mission: 'Estás en el Escritorio. Crea una carpeta llamada "Proyecto".',
    explanation: 'El comando mkdir (o md) crea un nuevo directorio en la ruta actual o en la ruta indicada.',
    hint: 'Escribe: mkdir Proyecto',
    validCommandPatterns: [
      /^mkdir\s+proyecto$/i,
      /^md\s+proyecto$/i,
      /^new-item\s+-itemtype\s+directory\s+-name\s+["']?proyecto["']?$/i,
      /^mkdir\s+["']proyecto["']$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop> mkdir Proyecto\n(Carpeta "Proyecto" creada con éxito)',
  },
  {
    id: 'win-02',
    title: 'Crear un archivo de texto vacío',
    os: 'windows',
    module: 'Windows - Archivos y Documentos',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Dentro de la carpeta Proyecto, crea un archivo vacío llamado "informe.txt".',
    explanation: 'En Windows puedes usar "type nul > archivo" o "echo. > archivo" para crear un fichero en blanco.',
    hint: 'Prueba: echo. > informe.txt  o  type nul > informe.txt',
    validCommandPatterns: [
      /^echo\.?\s*>\s*informe\.txt$/i,
      /^type\s+nul\s*>\s*informe\.txt$/i,
      /^new-item\s+informe\.txt$/i,
      /^copy\s+con\s+informe\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> type nul > informe.txt\n(Archivo informe.txt generado de tamaño 0 bytes)',
  },
  {
    id: 'win-03',
    title: 'Renombrar un archivo',
    os: 'windows',
    module: 'Windows - Archivos y Documentos',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Cambia el nombre del archivo "informe.txt" por "resumen.txt".',
    explanation: 'El comando "ren" (o rename) toma el nombre original y el nuevo nombre deseado.',
    hint: 'Usa: ren informe.txt resumen.txt',
    validCommandPatterns: [
      /^ren(ame)?\s+informe\.txt\s+resumen\.txt$/i,
      /^ren(ame)?\s+["']informe\.txt["']\s+["']resumen\.txt["']$/i,
      /^rename-item\s+informe\.txt\s+resumen\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> ren informe.txt resumen.txt\n(1 archivo renombrado a resumen.txt)',
  },
  {
    id: 'win-04',
    title: 'Crear múltiples subcarpetas',
    os: 'windows',
    module: 'Windows - Creación y Navegación',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Dentro de Proyecto, crea dos subcarpetas en un solo comando: "Imágenes" y "Documentos".',
    explanation: 'Puedes pasar múltiples nombres separados por espacios a mkdir para crearlos en lote.',
    hint: 'Usa: mkdir Imágenes Documentos (o Imagenes Documentos)',
    validCommandPatterns: [
      /^mkdir\s+(im[aá]genes\s+documentos|documentos\s+im[aá]genes)$/i,
      /^md\s+(im[aá]genes\s+documentos|documentos\s+im[aá]genes)$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> mkdir Imágenes Documentos\nDirectorios creados:\n  [DIR] Imágenes\n  [DIR] Documentos',
  },
  {
    id: 'win-05',
    title: 'Mover un archivo a otra carpeta',
    os: 'windows',
    module: 'Windows - Archivos y Documentos',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Mueve el archivo "resumen.txt" dentro de la carpeta "Documentos".',
    explanation: 'El comando "move" transfiere archivos de una ruta origen a una ruta destino.',
    hint: 'Escribe: move resumen.txt Documentos\\',
    validCommandPatterns: [
      /^move\s+resumen\.txt\s+documentos\\?$/i,
      /^move-item\s+resumen\.txt\s+documentos\\?$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> move resumen.txt Documentos\\\n        1 archivo(s) movido(s).',
  },
  {
    id: 'win-06',
    title: 'Eliminar un archivo en subcarpeta',
    os: 'windows',
    module: 'Windows - Eliminación y Limpieza',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Elimina el archivo "resumen.txt" ubicado dentro de la carpeta "Documentos".',
    explanation: '"del" (o erase) elimina archivos permanentes en Windows.',
    hint: 'Escribe: del Documentos\\resumen.txt',
    validCommandPatterns: [
      /^del\s+documentos\\resumen\.txt$/i,
      /^erase\s+documentos\\resumen\.txt$/i,
      /^remove-item\s+documentos\\resumen\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> del Documentos\\resumen.txt\n(Archivo eliminado)',
  },
  {
    id: 'win-07',
    title: 'Eliminar una carpeta vacía',
    os: 'windows',
    module: 'Windows - Eliminación y Limpieza',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: 'C:\\Users\\Alumno\\Desktop\\Proyecto',
    mission: 'Elimina la carpeta vacía "Imágenes".',
    explanation: 'El comando rmdir (o rd) borra un directorio siempre que esté vacío.',
    hint: 'Usa: rmdir Imágenes (o rmdir Imagenes)',
    validCommandPatterns: [
      /^rmdir\s+im[aá]genes$/i,
      /^rd\s+im[aá]genes$/i,
      /^remove-item\s+im[aá]genes$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop\\Proyecto> rmdir Imágenes\n(Directorio Imágenes eliminado)',
  },
  {
    id: 'win-08',
    title: 'Eliminar carpeta con contenido recursivo',
    os: 'windows',
    module: 'Windows - Eliminación y Limpieza',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: 'C:\\Users\\Alumno\\Desktop',
    mission: 'Elimina completamente la carpeta "Proyecto" junto con todo su contenido sin pedir confirmación.',
    explanation: 'Los modificadores /s borran subdirectorios y archivos, y /q activa el modo silencioso (quiet).',
    hint: 'Escribe: rmdir /s /q Proyecto',
    validCommandPatterns: [
      /^rmdir\s+(\/s\s+\/q|\/q\s+\/s)\s+proyecto$/i,
      /^rd\s+(\/s\s+\/q|\/q\s+\/s)\s+proyecto$/i,
      /^remove-item\s+-recurse\s+-force\s+proyecto$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop> rmdir /s /q Proyecto\n(Carpeta Proyecto y todo su árbol eliminados)',
  },
  {
    id: 'win-10',
    title: 'Crear archivo con contenido usando redirección',
    os: 'windows',
    module: 'Windows - Archivos y Documentos',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: 'C:\\Users\\Alumno\\Notas',
    mission: 'Crea un archivo llamado "lista.txt" que contenga el texto: Tareas pendientes',
    explanation: 'El operador de redirección > canaliza la salida de echo hacia un archivo nuevo.',
    hint: 'Usa: echo Tareas pendientes > lista.txt',
    validCommandPatterns: [
      /^echo\s+tareas\s+pendientes\s*>\s*lista\.txt$/i,
      /^echo\s+["']tareas pendientes["']\s*>\s*lista\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Notas> echo Tareas pendientes > lista.txt\n(Contenido escrito en lista.txt)',
  },
  {
    id: 'win-11',
    title: 'Visualizar el contenido de un archivo',
    os: 'windows',
    module: 'Windows - Archivos y Documentos',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: 'C:\\Users\\Alumno\\Notas',
    mission: 'Muestra por pantalla el contenido del archivo "lista.txt".',
    explanation: 'En Windows, "type" es el comando clásico para ver ficheros de texto.',
    hint: 'Escribe: type lista.txt',
    validCommandPatterns: [
      /^type\s+lista\.txt$/i,
      /^get-content\s+lista\.txt$/i,
      /^cat\s+lista\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Notas> type lista.txt\nTareas pendientes',
  },
  {
    id: 'win-14',
    title: 'Listar archivos y carpetas ocultas',
    os: 'windows',
    module: 'Windows - Creación y Navegación',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: 'C:\\Users\\Alumno',
    mission: 'Muestra todos los archivos del directorio actual, incluyendo archivos ocultos y del sistema.',
    explanation: 'El modificador /a muestra atributos específicos o todos los ficheros ocultos.',
    hint: 'Escribe: dir /a  o  dir /ah',
    validCommandPatterns: [
      /^dir\s+\/a$/i,
      /^dir\s+\/ah$/i,
      /^get-childitem\s+-force$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno> dir /a\n Directorio de C:\\Users\\Alumno\n\n16/11/2026  12:00    <DIR>          .\n16/11/2026  12:00    <DIR>          ..\n16/11/2026  10:15    <DIR>   [H]    .config\n16/11/2026  09:30             1.024 NTUSER.DAT\n16/11/2026  11:45    <DIR>          Documentos',
  },
  {
    id: 'win-17',
    title: 'Crear estructuras de carpetas anidadas',
    os: 'windows',
    module: 'Windows - Creación y Navegación',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: 'C:\\Users\\Alumno',
    mission: 'Crea en una sola línea la ruta completa: Empresa\\RecursosHumanos\\Contratos',
    explanation: 'mkdir crea automáticamente todas las carpetas intermedias que no existan.',
    hint: 'Usa: mkdir Empresa\\RecursosHumanos\\Contratos',
    validCommandPatterns: [
      /^mkdir\s+empresa\\recursoshumanos\\contratos$/i,
      /^md\s+empresa\\recursoshumanos\\contratos$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno> mkdir Empresa\\RecursosHumanos\\Contratos\n(Estructura anidada creada: Empresa -> RecursosHumanos -> Contratos)',
  },
  // NUEVOS RETOS WINDOWS EXTRAÍDOS DE UD3 (Atributos, Árbol y Tuberías)
  {
    id: 'win-tree-01',
    title: 'Ver árbol de directorios con archivos',
    os: 'windows',
    module: 'Windows - Inspección y Atributos',
    difficulty: 'fácil',
    xpReward: 65,
    startingDir: 'C:\\Users\\Alumno\\Empresa',
    mission: 'Visualiza la estructura gráfica en árbol de la carpeta actual incluyendo los nombres de los archivos.',
    explanation: 'El comando "tree" dibuja el árbol de carpetas. Con el parámetro /f muestra también los archivos en cada rama.',
    hint: 'Escribe: tree /f',
    validCommandPatterns: [
      /^tree\s+\/f$/i,
      /^tree$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Empresa> tree /f\nEstructura de carpetas para el volumen OS\nNúmero de serie del volumen: 84B2-79A1\nC:\\USERS\\ALUMNO\\EMPRESA\n├───Finanzas\n│   └───Informes\n│           balance_2026.xlsx\n└───RecursosHumanos\n    └───Contratos\n            contrato_dam.pdf',
  },
  {
    id: 'win-attrib-01',
    title: 'Ocultar archivo con attrib',
    os: 'windows',
    module: 'Windows - Inspección y Atributos',
    difficulty: 'medio',
    xpReward: 75,
    startingDir: 'C:\\Users\\Alumno\\Documentos',
    mission: 'Asigna el atributo de archivo oculto al archivo "claves.txt" usando el comando attrib.',
    explanation: 'En Windows, "attrib +h archivo" añade el atributo Hidden (oculto). Para quitarlo se usaría "-h".',
    hint: 'Escribe: attrib +h claves.txt',
    validCommandPatterns: [
      /^attrib\s+\+h\s+claves\.txt$/i,
      /^attrib\s+claves\.txt\s+\+h$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Documentos> attrib +h claves.txt\n(Atributo [H] Oculto asignado a claves.txt)',
  },
  {
    id: 'win-pipe-01',
    title: 'Filtrar texto en Windows con findstr',
    os: 'windows',
    module: 'Windows - Redirecciones y Filtros',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: 'C:\\Users\\Alumno',
    mission: 'Muestra por pantalla únicamente las líneas que contengan la palabra "ERROR" dentro del archivo "registro.log".',
    explanation: 'findstr es la herramienta nativa de Windows equivalente a grep para filtrar texto.',
    hint: 'Usa: findstr "ERROR" registro.log  o  type registro.log | findstr "ERROR"',
    validCommandPatterns: [
      /^findstr\s+["']?ERROR["']?\s+registro\.log$/i,
      /^type\s+registro\.log\s+\|\s+findstr\s+["']?ERROR["']?$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno> findstr "ERROR" registro.log\n[2026-11-16 10:14:02] ERROR: Fallo de autenticación en puerto 22\n[2026-11-16 11:05:43] ERROR: Disco secundario no montado',
  },
  {
    id: 'win-redir-01',
    title: 'Redirigir listado limpio a un archivo',
    os: 'windows',
    module: 'Windows - Redirecciones y Filtros',
    difficulty: 'medio',
    xpReward: 75,
    startingDir: 'C:\\Users\\Alumno\\Desktop',
    mission: 'Genera una lista en formato simple (/b) de todos los archivos y guárdala en un fichero llamado "catalogo.txt".',
    explanation: 'El parámetro /b de dir omite encabezados y resúmenes. Con > se canaliza hacia un nuevo archivo.',
    hint: 'Escribe: dir /b > catalogo.txt',
    validCommandPatterns: [
      /^dir\s+\/b\s*>\s*catalogo\.txt$/i,
      /^dir\s*>\s*catalogo\.txt$/i
    ],
    simulatedOutput: 'C:\\Users\\Alumno\\Desktop> dir /b > catalogo.txt\n(Salida redirigida a catalogo.txt)',
  },

  // ==========================================
  // LINUX (Bash)
  // ==========================================
  {
    id: 'linux-01',
    title: 'Crear un archivo de tamaño 0',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: '/home/usuario',
    mission: 'Crea un archivo vacío de tamaño 0 llamado "arch_tam0".',
    explanation: 'El comando "touch" actualiza la marca temporal de un archivo o lo crea vacío si no existe.',
    hint: 'Escribe: touch arch_tam0',
    validCommandPatterns: [
      /^touch\s+arch_tam0$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ touch arch_tam0\n(Archivo creado: -rw-r--r-- 1 usuario usuario 0 bytes arch_tam0)',
  },
  {
    id: 'linux-02',
    title: 'Listar directorio bin',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: '/home/usuario',
    mission: 'Lista todos los archivos y ejecutables del directorio /bin.',
    explanation: 'El comando ls muestra los ficheros del directorio indicado como argumento.',
    hint: 'Usa: ls /bin',
    validCommandPatterns: [
      /^ls\s+\/bin\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls /bin\nbash  cat  chmod  cp  date  grep  kill  ls  mkdir  mv  pwd  rm  rmdir  touch  wc',
  },
  {
    id: 'linux-03',
    title: 'Listado en orden inverso con filtro',
    os: 'linux',
    module: 'Linux - Filtros y Comodines',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: '/home/usuario',
    mission: 'Lista los archivos de /etc que empiecen por "t" en orden inverso.',
    explanation: 'El modificador -r invierte el orden alfabético del listado.',
    hint: 'Escribe: ls -r /etc/t*',
    validCommandPatterns: [
      /^ls\s+-r\s+\/etc\/t\*$/,
      /^ls\s+\/etc\/t\*\s+-r$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls -r /etc/t*\n/etc/tzdata  /etc/terminfo  /etc/timezone  /etc/tar.conf',
  },
  {
    id: 'linux-04',
    title: 'Comodines de longitud fija (?)',
    os: 'linux',
    module: 'Linux - Filtros y Comodines',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: '/home/usuario',
    mission: 'Lista los archivos de /dev que empiecen por "tty" y tengan exactamente 5 caracteres de longitud total.',
    explanation: 'Cada carácter "?" representa exactamente un carácter cualquiera (tty + ?? = 5 caracteres).',
    hint: 'Escribe: ls /dev/tty??',
    validCommandPatterns: [
      /^ls\s+\/dev\/tty\?\?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls /dev/tty??\n/dev/tty10  /dev/tty11  /dev/tty12  /dev/tty20  /dev/tty63',
  },
  {
    id: 'linux-05',
    title: 'Rangos de caracteres entre corchetes []',
    os: 'linux',
    module: 'Linux - Filtros y Comodines',
    difficulty: 'medio',
    xpReward: 75,
    startingDir: '/home/usuario',
    mission: 'Lista los dispositivos de /dev que empiecen por "tty" y acaben en 1, 2, 3 o 4.',
    explanation: 'Los corchetes [1-4] coinciden con cualquier dígito dentro del rango.',
    hint: 'Usa: ls /dev/tty[1-4]  o  ls /dev/tty[1,2,3,4]',
    validCommandPatterns: [
      /^ls\s+\/dev\/tty\[1-4\]$/,
      /^ls\s+\/dev\/tty\[1,2,3,4\]$/,
      /^ls\s+\/dev\/tty\*\[1-4\]$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls /dev/tty[1-4]\n/dev/tty1  /dev/tty2  /dev/tty3  /dev/tty4',
  },
  {
    id: 'linux-06',
    title: 'Listar todo con detalle y archivos ocultos',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: '/home/usuario',
    mission: 'Lista todos los archivos, incluidos los ocultos y detalles de permisos, del directorio raíz (/).',
    explanation: 'Las opciones -l (long format) y -a (all) son las más utilizadas por los administradores.',
    hint: 'Usa: ls -la /  o  ls -al /',
    validCommandPatterns: [
      /^ls\s+(-la|-al|-l\s+-a|-a\s+-l)\s+\/\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls -la /\ntotal 64\ndrwxr-xr-x  18 root root  4096 nov 16 00:00 .\ndrwxr-xr-x  18 root root  4096 nov 16 00:00 ..\nlrwxrwxrwx   1 root root     7 nov 16 00:00 bin -> usr/bin\ndrwxr-xr-x   2 root root  4096 nov 16 00:00 boot\ndrwxr-xr-x  14 root root  3120 nov 16 00:00 dev\ndrwxr-xr-x 115 root root 12288 nov 16 00:00 etc\ndrwxr-xr-x   3 root root  4096 nov 16 00:00 home\ndrwx------   2 root root 16384 nov 16 00:00 root\ndrwxrwxrwt  10 root root  4096 nov 16 00:00 tmp',
  },
  {
    id: 'linux-09',
    title: 'Navegación y verificación de ruta',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: '/home/usuario',
    mission: 'Cámbiate al directorio temporal /tmp y muestra tu ruta actual de trabajo.',
    explanation: '"cd /tmp" cambia de directorio y "pwd" (print working directory) imprime la ruta absoluta.',
    hint: 'Escribe: cd /tmp && pwd  o  cd /tmp; pwd',
    validCommandPatterns: [
      /^cd\s+\/tmp\s*(&&|;)\s*pwd$/,
      /^cd\s+\/tmp$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ cd /tmp && pwd\n/tmp',
  },
  {
    id: 'linux-11',
    title: 'Volver al directorio personal HOME',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'fácil',
    xpReward: 50,
    startingDir: '/var/log',
    mission: 'Desde /var/log, vuelve con un solo comando al directorio de tu usuario ($HOME).',
    explanation: 'Ejecutar simplemente "cd" sin parámetros te lleva directamente a tu carpeta personal.',
    hint: 'Escribe: cd  (o cd ~)',
    validCommandPatterns: [
      /^cd$/,
      /^cd\s+~$/,
      /^cd\s+\$HOME$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:/var/log$ cd\nusuario@ies-benigaslo:~$ pwd\n/home/usuario',
  },
  {
    id: 'linux-12',
    title: 'Creación de árbol anidado con mkdir -p',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: '/home/usuario',
    mission: 'Crea dentro del directorio PRUEBA la subcarpeta anidada: PRUEBA/dir3/dir31/dir311',
    explanation: 'El modificador -p (parents) genera todos los directorios padres si no existen sin dar error.',
    hint: 'Usa: mkdir -p PRUEBA/dir3/dir31/dir311',
    validCommandPatterns: [
      /^mkdir\s+-p\s+PRUEBA\/dir3\/dir31\/dir311\/?$/,
      /^mkdir\s+-p\s+~\/PRUEBA\/dir3\/dir31\/dir311\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ mkdir -p PRUEBA/dir3/dir31/dir311\n(Árbol de directorios creado: PRUEBA -> dir3 -> dir31 -> dir311)',
  },
  {
    id: 'linux-13',
    title: 'Copiar un archivo del sistema a tu carpeta',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: '/home/usuario',
    mission: 'Copia el archivo /etc/motd a un nuevo archivo llamado "mensaje" dentro de tu carpeta PRUEBA.',
    explanation: '"cp origen destino" copia ficheros conservando el archivo original.',
    hint: 'Usa: cp /etc/motd PRUEBA/mensaje  (o ~/PRUEBA/mensaje)',
    validCommandPatterns: [
      /^cp\s+\/etc\/motd\s+(~\/)?PRUEBA\/mensaje$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ cp /etc/motd PRUEBA/mensaje\n(Archivo copiado: PRUEBA/mensaje)',
  },
  {
    id: 'linux-18',
    title: 'Ocultar un archivo en Linux',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'medio',
    xpReward: 65,
    startingDir: '/home/usuario/PRUEBA',
    mission: 'Oculta el archivo "mensaje" renombrándolo a ".mensaje".',
    explanation: 'En Linux, cualquier archivo o directorio que empiece por un punto (.) se considera oculto.',
    hint: 'Escribe: mv mensaje .mensaje',
    validCommandPatterns: [
      /^mv\s+mensaje\s+\.mensaje$/,
      /^mv\s+\.\/mensaje\s+\.\/\.mensaje$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~/PRUEBA$ mv mensaje .mensaje\n(Archivo ocultado con éxito)',
  },
  {
    id: 'linux-19',
    title: 'Eliminar un directorio con contenido',
    os: 'linux',
    module: 'Linux - Archivos y Navegación',
    difficulty: 'medio',
    xpReward: 75,
    startingDir: '/home/usuario/PRUEBA',
    mission: 'Elimina el directorio "dir1" y todo lo que contenga de forma recursiva.',
    explanation: 'El comando rm con el parámetro -r (o -rf) elimina carpetas completas.',
    hint: 'Usa: rm -r dir1  o  rm -rf dir1',
    validCommandPatterns: [
      /^rm\s+(-r|-rf|-fr)\s+dir1\/?$/,
      /^rm\s+(-r|-rf|-fr)\s+\.\/dir1\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~/PRUEBA$ rm -rf dir1\n(Directorio dir1 eliminado recursivamente)',
  },
  {
    id: 'linux-24',
    title: 'Creación de enlace simbólico (Soft link)',
    os: 'linux',
    module: 'Linux - Enlaces y Permisos',
    difficulty: 'avanzado',
    xpReward: 90,
    startingDir: '/home/usuario',
    mission: 'Crea un enlace simbólico llamado "enlace_datos" que apunte al archivo "/var/log/syslog".',
    explanation: 'El modificador -s crea un soft link (acceso directo en Unix). Sin -s crearía un enlace duro (hard link).',
    hint: 'Usa: ln -s /var/log/syslog enlace_datos',
    validCommandPatterns: [
      /^ln\s+-s\s+\/var\/log\/syslog\s+enlace_datos$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ln -s /var/log/syslog enlace_datos\n(Enlace creado: enlace_datos -> /var/log/syslog)',
  },
  {
    id: 'linux-29',
    title: 'Gestión de permisos con chmod',
    os: 'linux',
    module: 'Linux - Enlaces y Permisos',
    difficulty: 'avanzado',
    xpReward: 95,
    startingDir: '/home/usuario',
    mission: 'Quita los permisos de escritura a todos (usuario, grupo y otros) en la carpeta "segura".',
    explanation: 'En notación simbólica: a-w (all minus write) o ugo-w. En octal suele ser chmod 555.',
    hint: 'Usa: chmod a-w segura  o  chmod u-w,g-w,o-w segura',
    validCommandPatterns: [
      /^chmod\s+(a-w|ugo-w|u-w,g-w,o-w|555)\s+segura\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ chmod a-w segura\n(Permisos actualizados: dr-xr-xr-x 2 usuario usuario segura)',
  },
  {
    id: 'linux-chmod-octal',
    title: 'Permisos en notación octal (755)',
    os: 'linux',
    module: 'Linux - Enlaces y Permisos',
    difficulty: 'medio',
    xpReward: 85,
    startingDir: '/home/usuario',
    mission: 'Asigna permisos 755 (lectura, escritura y ejecución para el dueño; lectura y ejecución para los demás) al script "deploy.sh".',
    explanation: '7 = rwx (4+2+1), 5 = r-x (4+0+1). Es el permiso estándar de ejecutables y scripts en Linux.',
    hint: 'Escribe: chmod 755 deploy.sh',
    validCommandPatterns: [
      /^chmod\s+755\s+deploy\.sh$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ chmod 755 deploy.sh\n-rwxr-xr-x 1 usuario usuario 1240 nov 16 12:00 deploy.sh',
  },
  // NUEVOS RETOS LINUX EXTRAÍDOS DE UD3 (Pipes, Find, Almacenamiento, Tar)
  {
    id: 'linux-pipe-01',
    title: 'Tuberías (Pipes): Conteo de procesos o archivos',
    os: 'linux',
    module: 'Linux - Tuberías y Redirecciones',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: '/home/usuario',
    mission: 'Conecta mediante una tubería (|) el listado de archivos de /etc con el comando wc para contar cuántas entradas hay.',
    explanation: 'La barra vertical (|) canaliza la salida estándar del primer comando como entrada del segundo.',
    hint: 'Escribe: ls /etc | wc -l',
    validCommandPatterns: [
      /^ls\s+\/etc\/?\s*\|\s*wc\s+-l$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ ls /etc | wc -l\n184',
  },
  {
    id: 'linux-find-01',
    title: 'Búsqueda por nombre con find',
    os: 'linux',
    module: 'Linux - Búsqueda y Localización',
    difficulty: 'medio',
    xpReward: 80,
    startingDir: '/home/usuario',
    mission: 'Busca dentro de /var todos los archivos que terminen con la extensión ".log".',
    explanation: '"find ruta -name patron" busca de forma recursiva a partir del directorio especificado.',
    hint: 'Usa: find /var -name "*.log"',
    validCommandPatterns: [
      /^find\s+\/var\/?\s+-name\s+["']?\*\.log["']?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ find /var -name "*.log"\n/var/log/dpkg.log\n/var/log/auth.log\n/var/log/syslog\n/var/log/boot.log\n/var/log/nginx/access.log',
  },
  {
    id: 'linux-disk-01',
    title: 'Inspeccionar espacio libre en disco',
    os: 'linux',
    module: 'Linux - Almacenamiento y Sistema',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: '/home/usuario',
    mission: 'Comprueba el espacio libre y ocupado en todos los sistemas de archivos montados en formato legible para humanos.',
    explanation: 'df (disk free) con la opción -h (human readable) muestra los tamaños en MB y GB.',
    hint: 'Escribe: df -h',
    validCommandPatterns: [
      /^df\s+-h$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ df -h\nS.ficheros     Tamaño Usados Disp Uso% Montado en\nudev             3,9G      0  3,9G   0% /dev\ntmpfs            792M   1,6M  790M   1% /run\n/dev/sda1        117G    32G   80G  29% /\ntmpfs            3,9G      0  3,9G   0% /dev/shm',
  },
  {
    id: 'linux-disk-02',
    title: 'Comprobar tamaño ocupado por una carpeta (du)',
    os: 'linux',
    module: 'Linux - Almacenamiento y Sistema',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: '/home/usuario',
    mission: 'Calcula el tamaño total resumido (-sh) que ocupa la carpeta /var/log en disco.',
    explanation: 'du (disk usage) con -s (summary) y -h (human readable) muestra la ocupación total sin listar cada subfichero.',
    hint: 'Escribe: du -sh /var/log',
    validCommandPatterns: [
      /^du\s+-sh\s+\/var\/log\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ du -sh /var/log\n428M\t/var/log',
  },
  {
    id: 'linux-tar-01',
    title: 'Empaquetar archivos con tar',
    os: 'linux',
    module: 'Linux - Compresión y Empaquetado',
    difficulty: 'medio',
    xpReward: 85,
    startingDir: '/home/usuario',
    mission: 'Crea un paquete llamado "copia.tar" que contenga todo el directorio "Documentos".',
    explanation: 'tar -cvf archivo.tar directorio (c = create, v = verbose, f = file).',
    hint: 'Escribe: tar -cvf copia.tar Documentos',
    validCommandPatterns: [
      /^tar\s+(-cvf|cvf)\s+copia\.tar\s+Documentos\/?$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ tar -cvf copia.tar Documentos\nDocumentos/\nDocumentos/informe.txt\nDocumentos/presupuesto.pdf\nDocumentos/notas.md\n(Paquete copia.tar creado correctamente)',
  },
  {
    id: 'linux-grep-01',
    title: 'Filtrado de texto con grep',
    os: 'linux',
    module: 'Linux - Tuberías y Redirecciones',
    difficulty: 'medio',
    xpReward: 70,
    startingDir: '/home/usuario',
    mission: 'Busca todas las líneas que contengan la palabra "cat" dentro del archivo "diccionario.txt".',
    explanation: 'grep busca patrones y cadenas de texto dentro de archivos o flujos de entrada.',
    hint: 'Escribe: grep "cat" diccionario.txt  (o grep cat diccionario.txt)',
    validCommandPatterns: [
      /^grep\s+["']?cat["']?\s+diccionario\.txt$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ grep "cat" diccionario.txt\nAlcatraz/M\nDecatur/M\nHecate/M\ncatastrophe/S\nscattered/U',
  },
  {
    id: 'linux-wc-01',
    title: 'Conteo de líneas con wc',
    os: 'linux',
    module: 'Linux - Tuberías y Redirecciones',
    difficulty: 'fácil',
    xpReward: 60,
    startingDir: '/home/usuario',
    mission: 'Cuenta cuántas líneas contiene el archivo "archivo1.txt" utilizando el comando wc.',
    explanation: 'El parámetro -l (lines) indica a wc que solo imprima el total de saltos de línea.',
    hint: 'Escribe: wc -l archivo1.txt',
    validCommandPatterns: [
      /^wc\s+-l\s+archivo1\.txt$/
    ],
    simulatedOutput: 'usuario@ies-benigaslo:~$ wc -l archivo1.txt\n42 archivo1.txt',
  }
];

// Helper to get custom exercises created dynamically by the tutor
export function getStoredCustomExercises(): Exercise[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('comandquest_custom_exercises');
  if (saved) {
    try {
      const parsed: Exercise[] = JSON.parse(saved);
      // Re-hydrate regex objects if string
      return parsed.map((e) => ({
        ...e,
        validCommandPatterns: e.validCommandPatterns.map((p) => {
          if (typeof p === 'string' && p.startsWith('/') && p.endsWith('/')) {
            return new RegExp(p.slice(1, -1), 'i');
          }
          return p;
        }),
      }));
    } catch {
      // fallback
    }
  }
  return [];
}

export function saveCustomExercise(exercise: Exercise): Exercise[] {
  const current = getStoredCustomExercises().filter((e) => e.id !== exercise.id);
  const updated = [...current, exercise];
  localStorage.setItem('comandquest_custom_exercises', JSON.stringify(updated));
  return updated;
}

export function deleteCustomExercise(id: string): Exercise[] {
  const current = getStoredCustomExercises().filter((e) => e.id !== id);
  localStorage.setItem('comandquest_custom_exercises', JSON.stringify(current));
  return current;
}

export function getAllExercises(): Exercise[] {
  const custom = getStoredCustomExercises();
  return [...BASE_EXERCISES, ...custom];
}

export function getModulesForExercises(allExercises: Exercise[]): ExerciseModule[] {
  const modulesMap = new Map<string, ExerciseModule>();

  allExercises.forEach((ex) => {
    const key = `${ex.os}-${ex.module}`;
    if (!modulesMap.has(key)) {
      modulesMap.set(key, {
        id: key.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: ex.module,
        os: ex.os,
        description: `Módulo formativo: ${ex.module}`,
        exercises: [],
      });
    }
    modulesMap.get(key)!.exercises.push(ex);
  });

  return Array.from(modulesMap.values());
}
